<template>
  <input
    type="range"
    :value="value"
    :min="min"
    :max="max"
    :step="step"
    class="h-range"
    @input="onInput"
  />
</template>
<script>
export default {
  name: 'HRange',
  props: {
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    step: {
      type: Number
    }
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value);
    }
  }
};
</script>

<style lang="scss">
.h-range {
  width: 100%;
}
</style>
