<template>
  <HBlock class="outerWrapperShadow" :class="[`topbar-bg-${color}`]">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="title" name="block" :disabled="disabled">
        <template slot="title">
          <div ref="header" class="collapse-header" @click.stop>
            <el-tooltip v-if="tip" class="item" effect="dark" :content="tip" placement="top-start">
              <span>{{ title }}</span>
            </el-tooltip>
            <span v-else>{{ title }}</span>
            <el-switch v-if="showSwitch" v-model="switchValue" @click.stop></el-switch>

            <el-button
              type="text"
              icon="el-icon-circle-plus-outline"
              @click="$emit('add')"
              v-if="showAdd"
              circle
            ></el-button>
            <EditYaml
              title="编辑Yaml源数据"
              :value="config"
              v-if="showEditYaml"
              @confirm="(e) => this.$emit('confirm', e)"
            />
            <el-button
              type="text"
              :disabled="preDisabled"
              style="font-size: 16px"
              icon="el-icon-d-arrow-left"
              @click="$emit('pre')"
              v-if="showPre"
              circle
            ></el-button>
            <el-button
              type="text"
              :disabled="nextDisabled"
              style="font-size: 16px"
              icon="el-icon-d-arrow-right"
              @click="$emit('next')"
              v-if="showNext"
              circle
            ></el-button>
          </div>
        </template>
        <slot></slot>
      </el-collapse-item>
    </el-collapse>
  </HBlock>
</template>
<script>
import EditYaml from './editYaml.vue';
import { getPropertyByPath } from '@/utils/index.js';
export default {
  name: 'HCollapse',
  components: {
    EditYaml
  },
  props: {
    title: {
      type: String
    },
    value: {
      type: Boolean,
      default: true
    },
    config: {
      type: String,
      default: ''
    },
    showSwitch: {
      type: Boolean,
      default: false
    },
    showEditYaml: {
      type: Boolean,
      default: false
    },
    showAdd: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'orange'
    },
    nextDisabled: {
      type: Boolean,
      default: false
    },
    preDisabled: {
      type: Boolean,
      default: false
    },
    showPre: {
      type: Boolean,
      default: false
    },
    showNext: {
      type: Boolean,
      default: false
    },
    carousel: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: 'block',
      switchValue: false,
      disabled: false
    };
  },
  computed: {
    tip() {
      return getPropertyByPath(this.tooltip);
    }
  },
  created() {
    this.switchValue = Boolean(this.value);
  },
  model: {
    prop: 'value',
    event: 'onSwitch'
  },
  watch: {
    value: {
      handler: function (val) {
        this.switchValue = val;
        if (!val) {
          this.disabled = true;
          this.activeName = '';
        }
      },
      immediate: true
    },
    switchValue(val) {
      this.$emit('onSwitch', val);
      if (val) {
        this.activeName = 'block';
        this.disabled = false;
      } else {
        this.activeName = '';
        this.disabled = true;
      }
    }
  },
  methods: {
    open() {
      this.activeName = 'block';
    }
  }
};
</script>

<style lang="scss" scoped>
.topbar-bg-orange {
  ::v-deep .el-collapse .el-collapse-item .el-collapse-item__header {
    background: $tabColor;
  }
  ::v-deep .el-collapse-item.is-disabled .el-collapse-item__header {
    color: rgba(255, 255, 255, 0.7);
  }
}

::v-deep .el-button + .el-button {
  margin-left: 0;
}
</style>
