<template>
  <time :datetime="value">{{ human }}</time>
</template>

<script>
export default {
  props: ['value'],
  computed: {
    human() {
      if (this.value === null || this.value.length == 0) return "";
      return (new Date(this.value)).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z');
    },
  }
}
</script>
