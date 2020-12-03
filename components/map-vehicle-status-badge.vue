<template>
  <b-badge :variant="variant">{{ text }}</b-badge>
</template>

<script>
// FIXME: i18n
const text_state = {
  "disabled": "Disabled",
  "in_use": "In Use",
  "available": "Available",
}

const variant_state = {
  "disabled": 'danger',
  "info": 'info',
  "available": 'success',
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
