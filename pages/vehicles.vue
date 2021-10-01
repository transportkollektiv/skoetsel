<template>
  <div>
    <b-card>
      <b-form-checkbox v-model="filter.onlyUsable" name="vehicleFilterUsable">Show only usable vehicles</b-form-checkbox>
    </b-card>
    <ul class="container-fluid">
      <li
        v-for="vehicle in mapdata" :key="vehicle.id"
        v-if="!filter.onlyUsable || (filter.onlyUsable && vehicle.state == 'usable')"
        class="vehicle"
      >
        <div class="row">
          <div class="col">
            <b-icon icon="bicycle"/>
            <span>#{{ vehicle.bike_number }}</span>
          </div>
          <div class="col">
            <span>{{ vehicle.state }}</span>
          </div>
          <div class="col">
            <mapVehicleStatusBadge :vehicle="vehicle" />
          </div>
        </div>
        <ul class="details">
          <li v-if="vehicle.lock" class="row">
            <div class="col">
              <b-icon icon="lock"/> <!-- lock.lock_type.form_factor -->
              <span>{{ vehicle.lock.lock_id }}</span>
              <br/>
              <small class="below-icon">{{ vehicle.lock.lock_type.name }}</small>
            </div>
            <div class="col"></div>
          </li>
          <li v-for="tracker in vehicle.trackers" class="row">
            <div class="col-4">
              <b-icon icon="geo"/> <!-- tracker_status -->
              <span>{{ tracker.device_id }}</span>
              <br/>
              <small v-if="tracker.tracker_type"  class="below-icon">{{ tracker.tracker_type.name }}</small>
            </div>
            <div class="col-2">
              <mapTrackerStatusBadge :tracker="tracker" />
              <b-badge pill class="badge-outline" v-if="tracker.internal">internal</b-badge>
            </div>
            <div class="col-3 col-battery">
              <b-icon icon="battery" rotate="270"/>
              <b-progress v-if="tracker.battery_voltage" :max="maxBatteryVoltage" :precision="2" show-value> <!-- FIXME -->
                <b-progress-bar :value="tracker.battery_voltage" :variant="tracker.battery_voltage >= tracker.tracker_type.battery_voltage_warning ? 'success' : (tracker.battery_voltage >= tracker.tracker_type.battery_voltage_critical ? 'warning' : 'danger')"></b-progress-bar>
              </b-progress>
            </div>
            <div class="col">
              <datetime :value="tracker.last_reported"/>
              <b-icon icon="exclamation-circle" variant="danger" v-if="(+new Date()) - Date.parse(tracker.last_reported) >= 1000 * 60 * 60 * 2" />
              <br/>
              <small>
                <relativedatetime :value="tracker.last_reported" />
              </small>
            </div>
          </li>
        </ul>

      </li>
    </ul>
  </div>
</template>

<script>
import mapVehicleStatusBadge from '~/components/map-vehicle-status-badge';
import mapTrackerStatusBadge from '~/components/map-tracker-status-badge';
import datetime from '~/components/datetime';
import relativedatetime from '~/components/relativedatetime';

export default {
  components: {
    mapVehicleStatusBadge,
    mapTrackerStatusBadge,
    datetime,
    relativedatetime,
  },
  data() {
    return {
      mapdata: [],
      maxBatteryVoltage: 3.9, // FIXME
      filter: {
        onlyUsable: false
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.mapdata = await this.$axios.$get('/api/maintenance/mapdata');
    },
  },
};
</script>

<style>
  .container-fluid li {
    list-style: none;
  }
  .details {
    margin: 0 0 0 2.5em;
    padding: 0;
  }
  .col-battery {
    display: flex;
    align-items: baseline;
  }
  .col-battery .b-icon {
    margin-right: 0.5em;
  }
  .col-battery .progress {
    flex: 1 0 auto;
  }
  .details li:hover {
    background: rgba(0,0,0,0.15);
  }
  .details small.below-icon {
    margin-left: 1.6em;
  }
  .vehicle {
    padding-bottom: 1.5em;
  }
  .badge-outline {
    background: transparent;
    color: #6c757d;
    border: 1px solid #6c757d;
  }
</style>
