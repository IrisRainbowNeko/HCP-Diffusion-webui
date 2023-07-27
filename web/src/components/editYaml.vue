<template>
  <div class="yaml-edit-wrapper">
    <div class="yaml-edit">
      <i class="icon-edit el-icon-edit-outline" @click="dialogVisible = true"></i>
    </div>

    <el-dialog
      :title="title"
      :visible="dialogVisible"
      width="50%"
      :before-close="cancel"
      append-to-body
    >
      <yaml-editor v-if="dialogVisible" v-model="yaml_data" />
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import YamlEditor from './YamlEditor.vue';
import yaml from 'js-yaml';
export default {
  name: 'EditYaml',
  components: { YamlEditor },
  props: {
    value: {
      type: [Object, Array]
    },
    title: {
      type: String,
      default: '编辑yaml源数据'
    }
  },
  data() {
    return {
      yaml_data: '',
      dialogVisible: false
    };
  },
  watch: {
    value: {
      handler: function (val) {
        this.yaml_data = yaml.dump(val);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    cancel() {
      this.dialogVisible = false;
      this.$emit('cancel');
    },
    save() {
      const obj = yaml.load(this.yaml_data);
      this.$emit('confirm', obj);
      //   for (const key in obj) {
      //     this.$set(this.value, key, obj[key]);
      //   }
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss">
.yaml-edit-wrapper {
  padding: 4px 15px;
  .yaml-edit {
    .icon-edit {
      font-size: 16px;
      cursor: pointer;
      color: #409eff;
      &:hover {
        color: 1283f3;
      }
    }
  }
  .el-dialog__body {
    padding: 0 20px 10px;
  }
  .config-row {
    align-items: center;
  }
}
@media screen and (max-width: 900px) {
  .yaml-edit-wrapper {
    .config-row {
      flex-direction: row !important;
    }
  }
}
</style>
