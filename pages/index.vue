<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <b-card class="mt-4" title="Vehicles">
            <b-card-text>
              <b-progress :max="vehicles.total" show-value>
                <b-progress-bar :value="vehicles.available" variant="success"></b-progress-bar>
                <b-progress-bar :value="vehicles.inUse" variant="info"></b-progress-bar>
                <b-progress-bar :value="vehicles.disabled" variant="danger"></b-progress-bar>
              </b-progress>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col>
          <b-card class="mt-4" title="Trackers">
            <b-card-text>
              Soon.
            </b-card-text>
          </b-card>
        </b-col>
        <b-col>
          <b-card class="mt-4" title="Stations">
            <b-card-text>
              Soon.
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vehicles: {
        total: 0,
        available: 0,
        inUse: 0,
        disabled: 0,
      }
    };
  },
  mounted() {
    this.fetchMapData();
  },
  methods: {
    async fetchMapData() {
      let data = await this.$axios.$get('/api/maintenance/mapdata');
      data.forEach((vehicle) => {
        this.vehicles.total++;
        // FIXME: mapping of short to long values has to move back into cykel
        switch (vehicle.availability_status) {
          case "DI":
            this.vehicles.disabled++;
            break;
          case "IU":
            this.vehicles.inUse++;
            break;
          case "AV":
            this.vehicles.available++;
            break;
        }
        // vehicle.trackers.forEach((tracker) => {});
      });
    },
  },
};
</script>
