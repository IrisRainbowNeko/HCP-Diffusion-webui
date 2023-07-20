<template>
  <div class="config-input-number-block">
    <p class="label">
      <el-tooltip v-if="tip" class="item" effect="dark" :content="tip" placement="top-start">
        <span>{{ label }}</span>
      </el-tooltip>
      <span v-else>{{ label }}</span>
    </p>
    <el-input-number
      ref="input"
      v-model="input"
      controls-position="right"
      :min="min"
      :max="max"
      :step="step"
      :controls="controls"
      :disabled="disabled"
      @change="onChange"
    ></el-input-number>
  </div>
</template>

<script>
import { getPropertyByPath } from '@/utils/index.js';
export default {
  name: 'HConfigInputNumber',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 1
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    step: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: true
    },
    integer: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Number
    },
    tooltip: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  computed: {
    tip() {
      return getPropertyByPath(this.tooltip);
    }
  },
  data() {
    return {
      input: ''
    };
  },
  created() {
    this.input = this.value;
  },
  watch: {
    value(val) {
      this.input = val;
    },
    input(val) {
      if (this.integer && !Number.isInteger(val)) {
        this.input = Math.floor(val);
        this.$refs.input.setCurrentValue(this.input);
      }
    },
    min(val) {
      if (this.range < val) {
        this.range = val;
      }
    },
    max(val) {
      if (this.range > val) {
        this.range = val;
      }
    },
    defaultValue(val) {
      this.input = val;
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.input);
    }
  }
};
</script>

<style lang="scss">
.config-input-number-block {
  flex: 1;
  .el-input-number {
    height: 35px;
    width: 100% !important;
    @include blockShadow();
    .el-input__inner {
      width: 100%;
      height: 35px;
    }
  }
}
</style>
