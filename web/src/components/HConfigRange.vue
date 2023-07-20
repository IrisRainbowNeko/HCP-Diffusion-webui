<template>
  <div class="config-range-block">
    <p class="label">
      <el-tooltip class="item" v-if="tip" effect="dark" :content="tip" placement="top-start">
        <span class="content">{{ label }}</span>
      </el-tooltip>
      <span class="content" v-else>{{ label }}</span>
      <el-input-number
        ref="input"
        v-model="range"
        :min="min"
        :max="max"
        :step="step"
        :controls="controls"
        controls-position="right"
        @change="handleInput"
      ></el-input-number>
    </p>
    <h-range :value="range" :min="min" :max="max" :step="step" @input="handleInput" />
  </div>
</template>
<script>
import HRange from '@/components/HRange.vue';
import { getPropertyByPath } from '@/utils/index.js';
export default {
  name: 'HConfigRange',
  components: {
    HRange
  },
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
    },
    label: {
      type: String,
      default: ''
    },
    controls: {
      type: Boolean,
      default: true
    },
    integer: {
      type: Boolean,
      default: false
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
  data() {
    return {
      range: 0
    };
  },
  computed: {
    tip() {
      return getPropertyByPath(this.tooltip);
    }
  },
  created() {
    this.range = this.value;
  },
  watch: {
    value(val) {
      this.range = val;
    },
    range(val) {
      if (this.integer && !Number.isInteger(val)) {
        this.range = Math.floor(val);
        this.$refs.input.setCurrentValue(this.range);
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
    }
  },
  methods: {
    handleInput(val) {
      this.range = Number(val);
      this.$emit('input', Number(val));
    }
  }
};
</script>

<style lang="scss">
.config-range-block {
  flex: 1;
  @include flexLayout(column, 0);
  .el-input-number {
    @include blockShadow();
  }
  .content {
    @include singleline-ellipsis();
  }
  .label {
    @include flexLayout();
    justify-content: space-between;
  }
}
</style>
