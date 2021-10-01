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
      return relativeTime.from(new Date(this.value));
    },
  }
}
</script>
