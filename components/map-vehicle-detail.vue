<template>
  <table>
    <!-- FIXME: i18n -->
    <tr><td>Status</td><td>{{ status }}</td></tr>
    <tr><td>Note</td><td>{{ vehicle.internal_note }}</td></tr>
    <tr v-if="vehicle.lock"><td>Lock ID</td><td>{{ vehicle.lock.lock_id }}</td></tr>
    <tr v-if="vehicle.lock"><td>Unlock key</td><td>{{ vehicle.lock.unlock_key }}</td></tr>
  </table>
</template>

<script>
// FIXME: i18n
const states = {
  "usable": "Usable",
  "broken": "Broken",
  "in_repair": "In Repair",
  "missing": "Missing",
}

export default {
  props: ['vehicle'],
  computed: {
    status() {
      return states[this.vehicle.state];
    },
  }
}
</script>
