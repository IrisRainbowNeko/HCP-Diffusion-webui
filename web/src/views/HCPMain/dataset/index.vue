<template>
  <div class="dataset-main">
    <h-block class="dataset-block outerWrapperShadow">
      <div class="config-row-header">generate dataset</div>
      <div class="config-row" style="height: 60px"></div>
      <div class="config-row">
        <HConfigInput label="out_dir" tooltip="dataset.out_dir" v-model="params.out_dir" />
      </div>
      <div class="config-row">
        <HConfigSelect
          label="prompt_file"
          tooltip="dataset.prompt_file"
          :options="list"
          v-model="params.prompt_file"
        />
      </div>
      <div class="config-row" style="margin-top: 40px">
        <el-button
          class="primary-btn"
          :disabled="isDisabled"
          type="primary"
          @click="handleGenerate"
        >
          Generate
        </el-button>
      </div>
    </h-block>
  </div>
</template>
<script>
import { generateDatasetAction, getDatesetAction } from '@/api/generate';
import useSnStore from '@/store/snStore';
export default {
  name: 'HDataset',
  props: {
    model: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      params: {
        prompt_file: '',
        out_dir: ''
      },
      isDisabled: false,
      list: []
    };
  },
  setup() {
    const snStore = useSnStore();
    return { snStore };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleGenerate() {
      const { prompt_file, out_dir } = this.params;
      const { model } = this;
      if (!prompt_file || !out_dir) {
        this.$message.error('please fill in completely');
        return;
      }
      this.isDisabled = true;
      generateDatasetAction({
        info: {
          prompt_file,
          out_dir,
          model
        }
      })
        .then((result) => {
          const { sn } = result;
          this.snStore.setDatasetSnSn(sn);
          this.$message.success('generate dataset is running, please waiting...');
        })
        .catch(() => {
          this.$message.error('operation failed');
        })
        .finally(() => {
          this.isDisabled = false;
        });
    },
    fetchData() {
      getDatesetAction(this.snStore.datasetSn).then((res) => {
        this.list = res.prompt_file;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.dataset-main {
  height: 100%;
  width: 100%;
  @include flexLayout(column);
  align-items: center;
  justify-content: center;
  .dataset-block {
    width: 340px;
    flex: inherit;
    position: relative;
    top: -50px;
    .config-row {
      ::v-deep .label {
        padding: 4px 0 14px 3px;
      }
      ::v-deep .block-style .el-button {
        font-size: 14px;
      }
    }
  }
}

.config-row-header {
  @include flexLayout(row, 0, center, center);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 60px;
  background: $tabColor;
  padding-left: 10px;
  font-size: 18px;
}
</style>
