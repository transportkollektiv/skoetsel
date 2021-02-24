<template>
  <div class="map-wrap d-flex flex-column">
    <client-only placeholder="Loading...">
      <l-map ref="map" :zoom="13" :center="mapCenter" @ready="onMapReady()">
        <l-tile-layer
          :url="tileUrl"
          :attribution="tileAttribution"
        ></l-tile-layer>
        <l-locate-control :options="locateOptions" />
      </l-map>
    </client-only>
    <div
      id="sidebar-footer"
      class="detailbar"
      v-if="detailVisible"
    >
      <div class="d-flex flex-row justify-content-between p-2">
        <mapVehicleDetail :vehicle="detail.vehicle" />
        <mapTrackerDetail :tracker="detail.tracker" v-if="detail.tracker" />
      </div>
      <footer>
        <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
          <strong class="mr-auto">
            {{ detail.vehicleType }} #{{ detail.vehicleNumber }}
            <mapVehicleStatusBadge :vehicle="detail.vehicle" />
          </strong>

          <b-button size="sm" @click="hide()">Close</b-button>
          <!-- FIXME: i18n -->
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import 'beautifymarker/leaflet-beautify-marker-icon.css';

import L from 'leaflet';
import 'beautifymarker';
import * as turf from '@turf/turf';
import LLocateControl from 'vue2-leaflet-locatecontrol';
import mapVehicleDetail from '~/components/map-vehicle-detail';
import mapTrackerDetail from '~/components/map-tracker-detail';
import mapVehicleStatusBadge from '~/components/map-vehicle-status-badge';

const bikeIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-bicycle" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="font-size: 1rem; margin-top: -7px;">
  <path fill-rule="evenodd" d="M4 4.5a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1v.5h4.14l.386-1.158A.5.5 0 0 1 11 4h1a.5.5 0 0 1 0 1h-.64l-.311.935.807 1.29a3 3 0 1 1-.848.53l-.508-.812-2.076 3.322A.5.5 0 0 1 8 10.5H5.959a3 3 0 1 1-1.815-3.274L5 5.856V5h-.5a.5.5 0 0 1-.5-.5zm1.5 2.443l-.508.814c.5.444.85 1.054.967 1.743h1.139L5.5 6.943zM8 9.057L9.598 6.5H6.402L8 9.057zM4.937 9.5a1.997 1.997 0 0 0-.487-.877l-.548.877h1.035zM3.603 8.092A2 2 0 1 0 4.937 10.5H3a.5.5 0 0 1-.424-.765l1.027-1.643zm7.947.53a2 2 0 1 0 .848-.53l1.026 1.643a.5.5 0 1 1-.848.53L11.55 8.623z"/>
</svg>`;

const lockIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-lock" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M11.5 8h-7a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1zm-7-1a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7zm0-3a3.5 3.5 0 1 1 7 0v3h-1V4a2.5 2.5 0 0 0-5 0v3h-1V4z"/>
</svg>`;

const getVehicleMarkerColor = (vehicle) => {
  switch (vehicle.availability_status) {
    case 'in_use':
      return 'blue';
    case 'available':
      return '#00b026';
    case 'disabled':
      return 'gray';
  }
};

const buildVehicleIcon = (vehicle, active = false) => {
  return L.BeautifyIcon.icon({
    isAlphaNumericIcon: true,
    text: bikeIcon,
    iconShape: 'marker',
    popupAnchor: [1, -39],
    borderColor: getVehicleMarkerColor(vehicle),
    textColor: active ? 'white' : getVehicleMarkerColor(vehicle),
    backgroundColor: active ? getVehicleMarkerColor(vehicle) : 'white',
  });
};

const buildTrackerIcon = (tracker, active = false) => {
  return L.BeautifyIcon.icon({
    isAlphaNumericIcon: true,
    text: tracker.internal ? lockIcon : '',
    iconStyle: 'font-size: 8px;',
    innerIconAnchor: [0, 0],
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    textColor: active ? 'white' : 'gray',
    backgroundColor: active ? 'gray' : 'white',
    borderColor: 'black',
    popupAnchor: [0, -10],
  });
};

export default {
  components: {
    LLocateControl,
    mapVehicleDetail,
    mapTrackerDetail,
    mapVehicleStatusBadge,
  },
  data() {
    return {
      mapReady: false,
      mapdata: [],
      mapCenter: [48.3925, 9.9938],
      tileUrl:
        'https://osm-demo-{s}.wheregroup.com/tiles/1.0.0/osm/webmercator/{z}/{x}/{y}.png',
      tileAttribution:
        'Map Data &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://wheregroup.com/">WhereGroup</a>',
      locateOptions: {
        // icon: "mdi mdi-near-me",
        // iconLoading: "mdi mdi-loading mdi-spin"
      },
      detailVisible: false,
      detail: {
        vehicleType: '',
        vehicleNumber: '',
        vehicle: null,
        tracker: null,
        layer: null,
      },
    };
  },
  mounted() {
    this.fetchMapData();
  },
  methods: {
    onMapReady() {
      this.mapReady = true;
      if (this.mapdata.length > 0) {
        this.renderMapData();
      } else {
        this.fetchMapData();
      }
      // setInterval(this.fetchMapData, 90 * 1000);
    },
    async fetchMapData() {
      this.mapdata = await this.$axios.$get('/api/maintenance/mapdata');
    },
    renderMapData() {
      this.mapdata.forEach((bike) => {
        // bike has no public location? fill with private trackers
        if (!bike.lat || !bike.lng) {
          bike.trackers.forEach((tracker) => {
            if (tracker.lat && tracker.lng) {
              bike.lat = tracker.lat;
              bike.lng = tracker.lng;
              bike.hasNoPublicLocation = true;
            }
          });
        }
        // still has no location? ignore bike
        if (!bike.lat || !bike.lng) {
          return;
        }

        let marker = L.marker([bike.lat, bike.lng], {
          icon: buildVehicleIcon(bike),
        });
        marker.bindTooltip(bike.bike_number, { direction: 'top', offset: [0, -32] });
        marker.addTo(this.$refs.map.mapObject);
        marker.on('click', (ev) => this.vehicleClicked(ev, marker, bike));

        // render red line if bike to tracker distance is too high
        if (bike.availability_status != 'in_use') {
          bike.trackers.forEach((tracker) => {
            if (!tracker.lng || !tracker.lat || tracker.tracker_status != 'active') {
              return;
            }
            let line = turf.lineString([
              [bike.lng, bike.lat],
              [tracker.lng, tracker.lat],
            ]);
            if (turf.length(line, { units: 'kilometers' }) > 0.5) {
              L.geoJSON(line, { style: { color: 'red' } }).addTo(
                this.$refs.map.mapObject
              );
            }
          });
        }
      });
    },
    vehicleClicked(ev, marker, bike) {
      // if we switch from vehicle to vehicle, cleanup
      if (this.detail.vehicleMarker) {
        this.detail.vehicleMarker.setIcon(
          buildVehicleIcon(this.detail.vehicle, false)
        );
      }
      if (this.detail.layer) {
        this.$refs.map.mapObject.removeLayer(this.detail.layer);
      }

      this.detail.vehicleType = 'Bike'; // FIXME
      this.detail.vehicleNumber = bike.bike_number;
      this.detail.vehicle = bike;
      this.detail.tracker = null;
      this.detailVisible = true;
      this.detail.layer = L.layerGroup();

      // replace with active marker
      marker.setIcon(buildVehicleIcon(bike, true));
      this.detail.vehicleMarker = marker;

      if (bike.availability_status != 'in_use') {
        bike.trackers.forEach((tracker) => {
          if (!tracker.lng || !tracker.lat) {
            return;
          }

          let line = turf.lineString([
            [bike.lng, bike.lat],
            [tracker.lng, tracker.lat],
          ]);
          L.geoJSON(line).addTo(this.detail.layer);
          let trackerMarker = L.marker([tracker.lat, tracker.lng], {
            icon: buildTrackerIcon(tracker),
          });
          trackerMarker.addTo(this.detail.layer);
          trackerMarker.on('click', (ev) =>
            this.trackerClicked(ev, trackerMarker, tracker)
          );
        });
      }
      this.detail.layer.addTo(this.$refs.map.mapObject);
    },
    trackerClicked(ev, marker, tracker) {
      if (this.detail.tracker && this.detail.trackerMarker) {
        this.detail.trackerMarker.setIcon(
          buildTrackerIcon(this.detail.tracker, false)
        );
      }

      this.detail.tracker = tracker;

      // replace with active marker
      marker.setIcon(buildTrackerIcon(tracker, true));
      this.detail.trackerMarker = marker;
    },
    hide() {
      this.detailVisible = false;
    }
  },
  watch: {
    mapdata() {
      if (this.mapReady) {
        this.renderMapData();
      }
    },
    detailVisible(newState) {
      // remove layer on detail close
      if (newState === false) {
        if (this.detail.layer) {
          this.$refs.map.mapObject.removeLayer(this.detail.layer);
          this.detail.layer = null;
        }
        if (this.detail.vehicleMarker) {
          this.detail.vehicleMarker.setIcon(
            buildVehicleIcon(this.detail.vehicle, false)
          );
          this.detail.vehicleMarker = null;
        }
      }
    },
  },
};
</script>

<style>
.map-wrap {
  height: 100%;
  width: 100%;
}

.detailbar {
  box-shadow: 0 -0.5rem 1rem rgba(0, 0, 0, 0.15);
  font-size: 0.9rem;
  z-index: 1035;
}

.detailbar table {
  max-width: 50%;
}
</style>
