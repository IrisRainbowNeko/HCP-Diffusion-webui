<template>
  <div :class="['block-style', hIndex && `header-bg-${hIndex}`]">
    <p
      class="tip"
      :class="[(showEditKey || showAdd || showEditYaml) && 'show-edit-style']"
      v-if="label"
    >
      <el-tooltip v-if="tip" class="item" effect="dark" :content="tip" placement="top-start">
        <span style="display: inline-block; height: 30px">
          {{ label }}
        </span>
      </el-tooltip>
      <span v-else style="display: inline-block; height: 30px">
        {{ label }}
      </span>
      <span>
        <el-switch v-if="showSwitch" v-model="switchValue"></el-switch>
        <i
          class="icon-edit-key el-icon-price-tag"
          v-if="showEditKey"
          @click="dialogVisible = true"
        ></i>
        <EditYaml
          title="编辑Yaml源数据"
          :value="config"
          v-if="showEditYaml"
          @confirm="(e) => this.$emit('confirm', e)"
        />
        <i
          class="icon-edit-key el-icon-circle-plus-outline"
          v-if="showAdd"
          style="color: #409eff"
          @click="$emit('onAdd')"
        ></i>
        <el-button
          type="text"
          :disabled="disabledPre"
          style="font-size: 16px"
          icon="el-icon-d-arrow-left"
          @click="$emit('pre')"
          v-if="showPre"
          circle
        ></el-button>
        <el-button
          type="text"
          :disabled="disabledNext"
          style="font-size: 16px"
          icon="el-icon-d-arrow-right"
          @click="$emit('next')"
          v-if="showNext"
          circle
        ></el-button>
      </span>
      <!-- 删除icon -->
      <i class="icon el-icon-delete" style="color: red" @click="onDelete" v-if="showIcon"></i>
    </p>
    <p v-if="!label && showSwitch">
      <el-switch v-if="showSwitch" v-model="switchValue"></el-switch>
    </p>
    <slot></slot>

    <el-dialog
      :title="`修改 '${label}' key 名称`"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-input placeholder="请输入新key名称" v-model="newKeyName"></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" :disabled="newKeyName === label" @click="save">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import EditYaml from './editYaml.vue';
import { getPropertyByPath } from '@/utils/index.js';
export default {
  name: 'HBlock',
  components: {
    EditYaml
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    // 用于控制是否显示删除icon
    showIcon: {
      type: Boolean,
      default: false
    },
    // 用于控制是否显示开关
    showSwitch: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    config: {
      type: String,
      default: ''
    },
    showEditKey: {
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
    showNext: {
      type: Boolean,
      default: false
    },
    showPre: {
      type: Boolean,
      default: false
    },
    hIndex: {
      type: Number,
      default: 0
    },
    disabledPre: {
      type: Boolean,
      default: false
    },
    disabledNext: {
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
      switchValue: false,
      dialogVisible: false,
      newKeyName: ''
    };
  },
  computed: {
    tip() {
      return getPropertyByPath(this.tooltip);
    }
  },
  watch: {
    switchValue(val) {
      this.$emit('input', val);
      this.$emit('onSwitch', val);
    },
    value(val) {
      if (this.showSwitch) {
        this.switchValue = val;
      }
    },
    dialogVisible(val) {
      this.newKeyName = val ? this.label : '';
    }
  },
  created() {
    if (this.showSwitch) {
      this.switchValue = this.value;
    }
    if (this.showEditKey) {
      this.newKeyName = this.label;
    }
  },
  methods: {
    onDelete() {
      this.$emit('onDelete');
    },
    save() {
      this.$emit('onEditKey', {
        oldKeyName: this.label,
        newKeyName: this.newKeyName
      });
      this.dialogVisible = false;
    },
    handleClose() {
      this.dialogVisible = false;
    }
  }
};
</script>
