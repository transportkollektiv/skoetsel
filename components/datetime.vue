<template>
  <time :datetime="value">{{ human }}</time>
</template>

<script>
export default {
  props: ['value'],
  computed: {
    human() {
      return (new Date(this.value)).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z');
    },
  }
}
</script>
