<template>
  <time :datetime="value">{{ human }}</time>
</template>

<script>
import RelativeTime from '@yaireo/relative-time';
const relativeTime = new RelativeTime();

export default {
  props: ['value'],
  computed: {
    human() {
      if (this.value === null || this.value.length == 0) return "";
      return relativeTime.from(new Date(this.value));
    },
  }
}
</script>
