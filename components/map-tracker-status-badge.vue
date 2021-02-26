<template>
  <b-badge :variant="variant">{{ text }}</b-badge>
</template>

<script>
const variant_state = {
  "decommissioned": 'danger',
  "inactive": 'danger',
  "missing": 'info',
  "active": 'success',
}

export default {
  props: ['tracker'],
  computed: {
    variant() {
      return variant_state[this.tracker.tracker_status];
    },
    text() {
      let s = this.tracker.tracker_status;
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
  }
}
</script>
