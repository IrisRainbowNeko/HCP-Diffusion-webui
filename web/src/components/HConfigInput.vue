<template>
  <div class="config-input-block">
    <p class="label">
      <el-tooltip v-if="tip" class="item" effect="dark" :content="tip" placement="top-start">
        <span :class="required && 'is-required'">{{ label }}</span>
      </el-tooltip>
      <span v-else :class="required && 'is-required'">{{ label }}</span>
    </p>
    <el-input
      v-if="type !== 'file'"
      :minlength="minlength"
      :maxlength="maxlength"
      v-model="input"
      :disabled="disabled"
      @change="onChange"
    />
    <el-input
      v-if="type === 'file' && !input"
      ref="fileInput"
      type="file"
      :accept="accept"
      :disabled="disabled"
      @input="onInput"
    />
    <p class="file-content" v-if="type === 'file' && input">
      <span>{{ input }}</span>
      <el-button type="text" @click="cleanFile">删除</el-button>
    </p>
  </div>
</template>

<script>
import { uploadFile } from '@/api/file.js';
import { getPropertyByPath } from '@/utils/index.js';
export default {
  name: 'HConfigInput',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    // 文件格式限制
    accept: {
      type: String,
      default: '.jpg,.png,.jpeg,.json'
    },
    minlength: {
      type: Number,
      default: 0
    },
    maxlength: {
      type: Number,
      default: 1000
    },
    required: {
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
    event: 'input',
    tip: ''
  },
  data() {
    return {
      input: ''
    };
  },
  computed: {
    tip() {
      return getPropertyByPath(this.tooltip);
    }
  },
  watch: {
    value(val) {
      this.input = val;
    }
  },
  created() {
    this.input = this.value;
  },
  methods: {
    onChange() {
      this.$emit('input', this.input);
    },
    async onInput() {
      if (this.type === 'file') {
        const file = this.$refs.fileInput.$refs.input.files[0];
        if (!file) {
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const result = await uploadFile(formData).catch((err) => {
          this.$message.error(err);
        });
        if (!result) {
          this.$message.error('上传失败');
          return;
        }
        const { url } = result;
        this.input = url;
        this.$emit('input', `${url}`);
        return;
      }
    },
    cleanFile() {
      this.input = '';
      this.$emit('input', '');
    }
  }
};
</script>

<style lang="scss">
.config-input-block {
  flex: 1;
  overflow: hidden;
  .el-input {
    width: 100%;
    height: 35px;
    @include blockShadow();
    .el-input__inner {
      height: 100%;
    }
  }
  .file-content {
    width: 100%;
    height: 35px;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    padding: 0 15px;
    line-height: 35px;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 0 8px 0 rgba(232, 237, 255, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > span {
      display: inline-block;
      flex: 1;
      margin-right: 10px;
      @include singleline-ellipsis();
    }
    .el-button {
      padding: 0;
      height: 100%;
      line-height: 35px;
    }
    &:hover {
      border-color: #c0c4cc;
    }
  }
}
</style>
