<template>
  <table>
    <!-- FIXME: i18n -->
    <tr><td>Tracker ID</td><td><strong>{{ tracker.device_id }}</strong> <mapTrackerStatusBadge :tracker="tracker" /></td></tr>
    <tr><td>Internal</td><td>{{ tracker.internal }}</td></tr>
    <tr><td>Battery voltage</td><td>{{ tracker.battery_voltage }} V</td></tr>
    <tr v-if="tracker.tracker_type"><td>Tracker Type</td><td>{{ tracker.tracker_type.name }}</td></tr>
    <tr><td>Last Message</td><td>{{ last_reported }}</td></tr>
    <tr><td>Last Location update</td><td>{{ last_location_reported }}</td></tr>
  </table>
</template>

<script>
import mapTrackerStatusBadge from '~/components/map-tracker-status-badge';

export default {
  components: {
      mapTrackerStatusBadge,
  },
  props: ['tracker'],
  computed: {
    last_reported() {
      return new Date(this.tracker.last_reported).toLocaleString();
    },
    last_location_reported() {
      return new Date(this.tracker.last_location_reported).toLocaleString();
    },
  }
}
</script>
