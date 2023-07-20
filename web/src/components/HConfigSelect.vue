<template>
  <div class="config-select-block">
    <p class="label">
      <el-tooltip v-if="tip" class="item" effect="dark" :content="tip" placement="top-start">
        <span :class="required && 'is-required'">{{ label }}</span>
      </el-tooltip>
      <span v-else :class="required && 'is-required'">{{ label }}</span>
    </p>
    <div class="select-wrap">
      <el-select v-model="val" placeholder="请选择" @change="handleOnChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="refresh-btn" v-if="showRefresh">
        <i
          :class="loading || defaultLoading ? 'el-icon-loading' : 'el-icon-refresh'"
          @click="handleRefresh"
        ></i>
      </span>
      <slot />
    </div>
  </div>
</template>
<script>
import { getPropertyByPath } from '@/utils/index.js';
export default {
  name: 'HConfigSelect',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Array]
    },
    label: {
      type: String,
      default: ''
    },
    showRefresh: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    isAllowNull: {
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
      val: '',
      defaultLoading: false
    };
  },
  computed: {
    tip() {
      return getPropertyByPath(this.tooltip);
    }
  },
  watch: {
    value: {
      handler: function (val) {
        if (this.defaultValue || this.isAllowNull) return;
        if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        this.val = val;
      },
      immediate: true
    },
    defaultValue: {
      handler: function (val) {
        if (!val) return;
        this.val = val;
      },
      immediate: true
    },
    options: {
      handler(val) {
        // 无值的情况下 默认复制第一个
        if (this.val || this.value || !val.length || this.isAllowNull) return;
        this.val = val[0].value;
        this.$emit('input', this.val);
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    if (this.defaultValue) {
      this.val = this.defaultValue;
      return;
    }
    if (typeof val === 'object') {
      this.val = JSON.stringify(this.value);
    } else {
      this.val = this.value;
    }
  },
  mounted() {
    if (this.isAllowNull) return;
    // 无值的情况下 默认复制第一个
    setTimeout(() => {
      if (!this.val && this.options.length) {
        this.val = this.options[0].value;
        this.$emit('input', this.val);
      }
    }, 1000);
  },
  methods: {
    handleOnChange(val) {
      this.val = val;
      this.$emit('input', val);
      this.$emit('onChange', val);
    },
    handleRefresh() {
      this.defaultLoading = true;
      setTimeout(() => {
        this.defaultLoading = false;
      }, 500);
      if (this.loading) return;
      this.$emit('refresh');
    }
  }
};
</script>

<style lang="scss">
.config-select-block {
  flex: 1;
  @include flexLayout(column, 0);
  .select-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    .el-select {
      flex: 1;
      @include blockShadow();
    }
    .refresh-btn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      text-align: center;
      color: #fff;
      background-color: #409eff;
      cursor: pointer;
      margin-left: 10px;
      i {
        font-size: 18px;
      }
      &:hover {
        background-color: #66b1ff;
      }
    }
  }
}
</style>
