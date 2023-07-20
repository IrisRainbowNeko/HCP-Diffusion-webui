<template>
  <div class="word-name-wrapper">
    <div class="word-names">
      <el-tooltip class="item" effect="dark" :content="JSON.stringify(value)" placement="top">
        <span class="content">{{ value }}</span>
      </el-tooltip>
      <i class="icon-edit el-icon-edit-outline" @click="dialogVisible = true"></i>
    </div>

    <el-dialog
      :title="title"
      :visible="dialogVisible"
      width="400px"
      :before-close="cancel"
      append-to-body
    >
      <div class="config-row" v-for="(item, index) in keyValues" :key="index">
        <h-config-input label="key" v-model="keyValues[index][0]" />
        <h-config-input label="value" v-model="keyValues[index][1]" />

        <i
          class="icon-delete el-icon-remove-outline"
          style="color: red"
          @click="deleteItem(index)"
        ></i>
      </div>
      <el-button type="text" @click="add" icon="el-icon-circle-plus-outline"></el-button>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { isObjectOrArray } from '@/utils/index';
export default {
  name: 'EditWordName',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '编辑word_names'
    }
  },
  data() {
    return {
      keyValues: [],
      dialogVisible: false
    };
  },
  watch: {
    value: {
      handler: function (val) {
        const keyValue = Object.entries(val);
        this.keyValues = keyValue.map((item) => {
          if (typeof item[1] === 'object') {
            item[1] = JSON.stringify(item[1]);
          }
          return [item[0], item[1]];
        });
      },
      immediate: true
    }
  },
  methods: {
    add() {
      this.keyValues.push(['', '']);
    },
    deleteItem(index) {
      this.keyValues.splice(index, 1);
    },
    cancel() {
      this.dialogVisible = false;
      this.$emit('cancel');
    },
    save() {
      const obj = {};
      this.keyValues.forEach((item) => {
        if (item[0] && item[1]) {
          if (isObjectOrArray(item[1])) {
            item[1] = JSON.parse(item[1]);
          }
          obj[item[0]] = item[1];
        }
      });
      this.$emit('confirm', obj);
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss">
.word-name-wrapper {
  padding: 4px 15px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
  .word-names {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .content {
      display: block;
      width: 80%;
      word-break: break-all;
    }
    .icon-edit {
      font-size: 16px;
      cursor: pointer;
      color: #409eff;
      &:hover {
        color: 1283f3;
      }
    }
  }
  .icon-delete {
    margin-top: 22px;
    font-size: 20px;
    cursor: pointer;
    color: red;
    &:hover {
      color: rgb(255, 113, 113);
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
  .word-name-wrapper {
    .config-row {
      flex-direction: row !important;
    }
  }
}
</style>
