<template>
  <b-badge :variant="variant">{{ text }}</b-badge>
</template>

<script>
// FIXME: mapping of short to long values has to move back into cykel
// FIXME: i18n
const text_state = {
  DI: "Disabled",
  IU: "In Use",
  AV: "Available",
}

const variant_state = {
  DI: 'danger',
  IU: 'info',
  AV: 'success',
}

export default {
  props: ['vehicle'],
  computed: {
    text() {
      return text_state[this.vehicle.availability_status];
    },
    variant() {
      return variant_state[this.vehicle.availability_status];
    },
  }
}
</script>
