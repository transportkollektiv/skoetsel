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
// FIXME: mapping of short to long values has to move back into cykel
// FIXME: i18n
const states = {
  US: "Usable",
  BR: "Broken",
  IR: "In Repair",
  MI: "Missing",
}

const availability_states = {
  DI: "Disabled",
  IU: "In Use",
  AV: "Available",
}

export default {
  props: ['vehicle'],
  computed: {
    availablility() {
      return availability_states[this.vehicle.availability_status];
    },
    status() {
      return states[this.vehicle.state];
    },
  }
}
</script>
