<template>
  <div class="tag-select-block" :class="label && 'show-label'">
    <p class="label" v-if="label">
      <el-tooltip v-if="tip" class="item" effect="dark" :content="tip" placement="top-start">
        <span>{{ label }}</span>
      </el-tooltip>
      <span v-else>{{ label }}</span>
    </p>
    <el-select
      class="tag-select"
      v-model="tags"
      multiple
      filterable
      allow-create
      default-first-option
      placeholder="请输入"
      :disabled="disabled"
      :clearable="clearable"
      @change="onChange"
    >
      <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
    </el-select>
  </div>
</template>
<script>
import { getPropertyByPath } from '@/utils/index.js';
export default {
  name: 'HConfigTagSelect',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      tags: []
    };
  },
  computed: {
    tip() {
      return getPropertyByPath(this.tooltip);
    }
  },
  watch: {
    value(val) {
      this.tags = val;
    }
  },
  created() {
    this.tags = this.value;
  },
  methods: {
    onChange(val) {
      this.$emit('change', val);
    }
  }
};
</script>

<style lang="scss">
.tag-select-block {
  flex: 1;
  .tag-select {
    width: 100%;
    height: auto;
    margin-top: 10px;
    @include blockShadow();
  }
  &.show-label {
    .tag-select {
      margin-top: 0;
    }
  }
}
</style>
