<template>
  <div class="config-input-block">
    <p class="label">
      <span>{{ label }}</span>
    </p>
    <div class="inputs">
      <el-input
        v-model.number="height"
        :disabled="disabled"
        @change="onChangeHeight"
        @blur="onBlur"
      />
      <span class="method">{{ method }}</span>
      <el-input
        v-model.number="width"
        :disabled="disabled"
        @change="onChangeWidth"
        @blur="onBlur"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HConfigInputSum',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Array],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    method: {
      type: String,
      default: '*'
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      height: 0,
      width: 0
    };
  },
  watch: {
    value(val) {
      let value = val;
      if (typeof val === 'object') {
        value = this.value[0];
      }
      const [height, width] = value.split(this.method);
      this.height = height;
      this.width = width;
    }
  },
  created() {
    let value = this.value;
    if (typeof value === 'object') {
      value = this.value[0];
    }
    const [height, width] = value.split(this.method);
    this.height = height;
    this.width = width;
  },
  methods: {
    onChangeHeight(val) {
      this.height = val;
    },
    onChangeWidth(val) {
      this.width = val;
    },
    onBlur() {
      this.$emit('input', [`${this.height}${this.method}${this.width}`]);
    }
  }
};
</script>

<style lang="scss">
.config-input-block {
  flex: 1;
  overflow: hidden;
  .inputs {
    width: 100%;
    display: flex;
    align-items: center;
    .el-input {
      flex: 1;
      height: 35px;
      @include blockShadow();
      .el-input__inner {
        height: 100%;
      }
    }
    .method {
      margin: 0 10px;
    }
  }
}
</style>
