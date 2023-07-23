<template>
  <div class="train-wrapper">
    <div class="train-left">
      <HBlock class="outerWrapperShadow">
        <slot name="changeModel"></slot>
      </HBlock>
      <HBlock class="outerWrapperShadow">
        <div class="btns">
          <el-button
            class="primary-btn"
            type="primary"
            @click="handleTrain"
            v-if="progress === 0 || progress === 100"
          >
            Train
          </el-button>
          <el-button class="interrupt-btn" type="primary" @click="handleInterrupt" v-else>
            Interrupt
          </el-button>
        </div>
        <div class="config-row">
          <el-radio-group v-model="train_mode">
            <el-radio :label="1">with accelerate and only one gpu</el-radio>
            <el-radio :label="0">with accelerate</el-radio>
            <el-radio :label="2">with colossal-AI</el-radio>
          </el-radio-group>
        </div>
      </HBlock>
      <HBlock class="outerWrapperShadow">
        <div class="config-row">
          <HConfigInput
            label="exp_dir"
            tooltip="train.exp_dir"
            style="font-size: 13px"
            disabled
            v-model="params.exp_dir"
          />
        </div>
        <div class="config-row">
          <HConfigSelect
            label="mixed_precision"
            style="font-size: 13px"
            :options="dtype_options"
            tooltip="train.mixed_precision"
            v-model="params.mixed_precision"
          />
        </div>
        <div class="config-row">
          <HConfigInputNumber
            tooltip="train.seed"
            label="seed"
            style="font-size: 13px"
            :min="1"
            v-model="params.seed"
          />
        </div>
        <div class="config-row">
          <HConfigSelect
            label="ckpt_type"
            tooltip="train.ckpt_type"
            style="font-size: 13px"
            :options="ckpt_type_options"
            v-model="params.ckpt_type"
          />
        </div>
        <div class="config-row">
          <el-checkbox v-model="params.allow_tf32">allow_tf32</el-checkbox>
        </div>
      </HBlock>
      <HBlock
        class="outerWrapperShadow outerWrapperShadow-other"
        v-if="progress !== 0 && progress !== 100"
      >
        <div class="config-row">
          <p>training progress</p>
        </div>
        <div class="config-row">
          <el-progress type="dashboard" :percentage="progress" :color="colors"></el-progress>
        </div>
      </HBlock>
    </div>

    <div class="train-right">
      <el-tabs v-model="tabName" class="outerWrapperShadow" ref="tabRef">
        <!-- model -->
        <el-tab-pane label="model" name="model">
          <ModelConfig
            :params="params"
            @updateData="(value) => this.$set(this.params, 'model', value)"
          />
        </el-tab-pane>
        <!-- tokenizer_pt -->
        <el-tab-pane label="tokenizer_pt" name="tokenizer_pt">
          <TokenizerPtConfig
            :params="params"
            :tokenizer_pt_train_name_options="tokenizer_pt_train_name_options"
            @updateData="(value) => this.$set(this.params, 'tokenizer_pt', value)"
          />
        </el-tab-pane>
        <!-- train -->
        <el-tab-pane label="train" name="train">
          <TrainConfig
            :params="params"
            :loss-config="lossConfig"
            @updateData="(value) => this.$set(this.params, 'train', value)"
          />
        </el-tab-pane>
        <!-- unet -->
        <el-tab-pane label="unet" name="unet">
          <UnetConfig
            :params="params"
            :is-open-unet-collapse="isOpenUnetCollapse"
            @updateData="(value) => this.$set(this.params, 'unet', value)"
          />
        </el-tab-pane>
        <!-- text_encoder -->
        <el-tab-pane label="text_encoder" name="text_encoder">
          <TextEncoderConfig
            :params="params"
            :is-open-text-encoder-collapse="isOpenTextEncoderCollapse"
            @updateData="(value) => this.$set(this.params, 'text_encoder', value)"
          />
        </el-tab-pane>
        <!-- lora_unet -->
        <el-tab-pane label="lora_unet" name="lora_unet">
          <LoraUnetConfig
            :params="params"
            :is-open-lora-unet-collapse="isOpenLoraUnetCollapse"
            @updateData="(value) => this.$set(this.params, 'lora_unet', value)"
          />
        </el-tab-pane>
        <!-- lora_text_encoder -->
        <el-tab-pane label="lora_text_encoder" name="lora_text_encoder">
          <LoraTextEncoderConfig
            :params="params"
            @updateData="(value) => this.$set(this.params, 'lora_text_encoder', value)"
          />
        </el-tab-pane>
        <!-- plugin_unet -->
        <el-tab-pane label="plugin_unet" name="plugin_unet">
          <PluginUnetConfig
            :params="params"
            @updateData="(value) => this.$set(this.params, 'plugin_unet', value)"
          />
        </el-tab-pane>
        <!-- plugin_TE -->
        <el-tab-pane label="plugin_TE" name="plugin_TE">
          <PluginTEConfig
            :params="params"
            @updateData="(value) => this.$set(this.params, 'plugin_TE', value)"
          />
        </el-tab-pane>
        <!-- data -->
        <el-tab-pane label="data" name="data">
          <DataConfig
            :params="params"
            :tab-height="tabHeight"
            @updateData="(value) => this.$set(this.params, 'data', value)"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import ModelConfig from './components/modelConfig.vue';
import TokenizerPtConfig from './components/tokenizerPtConfig.vue';
import TextEncoderConfig from './components/textEncoderConfig.vue';
import UnetConfig from './components/unetConfig.vue';
import LoraUnetConfig from './components/loraUnetConfig.vue';
import LoraTextEncoderConfig from './components/loraTextEncoderConfig.vue';
import PluginUnetConfig from './components/pluginUnetConfig.vue';
import PluginTEConfig from './components/pluginTEConfig.vue';
import DataConfig from './components/dataConfig.vue';
import TrainConfig from './components/trainConfig.vue';
import {
  default_train_data,
  ckpt_type_options,
  dtype_options,
  lossConfigKeys,
  lossConfigs,
  STATUS_TYPE
} from '@/constants/index';

import { getTrain, updateTrain, getTrainStatus, stopTrain } from '@/api/train';
import { handleOptions } from '@/utils/index';
import { merge, isEmpty } from 'lodash-es';
import useSnStore from '@/store/snStore';
export default {
  name: 'HTrain',
  components: {
    ModelConfig,
    TokenizerPtConfig,
    TextEncoderConfig,
    UnetConfig,
    LoraUnetConfig,
    LoraTextEncoderConfig,
    PluginUnetConfig,
    PluginTEConfig,
    DataConfig,
    TrainConfig
  },
  props: {
    yaml_template_sn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tabName: 'model',
      imgs: [],
      ckpt_type_options,
      tokenizer_pt_train_name_options: [],
      pretrained_model_name_or_path_options: [],
      dtype_options,
      params: JSON.parse(JSON.stringify(default_train_data)),
      disabled: false,
      progress: 0,
      timer: null,
      // 训练类型
      train_mode: 1,
      lossConfigKeysOptions: lossConfigKeys,
      lossConfig: '',
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      isOpenUnetCollapse: false,
      isOpenTextEncoderCollapse: false,
      isOpenPluginUnetCollapse: false,
      isOpenPluginTeCollapse: false,
      isOpenLoraUnetCollapse: false,
      isOpenDataCollapse: false,
      isOpenLoraTextEncoderCollapse: false,
      tabHeight: 1000,
      scrollPosition: 0,

      isOpenImgTransforms: false
    };
  },
  setup() {
    const snStore = useSnStore();
    return { snStore };
  },
  watch: {
    lossConfig(val) {
      this.params.train.loss.criterion = lossConfigs[val];
    }
  },
  created() {
    this.initDefaultData();
  },
  mounted() {
    if (this.$refs.tabRef) {
      this.tabHeight = this.$refs.tabRef.$el.offsetHeight - 174;
    }
  },
  methods: {
    async handleInterrupt() {
      const result = await stopTrain(this.trainSn).catch(() => {
        this.$message.error('interrupt failed');
      });
      if (!result) return;
      const { status } = result;
      this.progress = 0;
      this.$message.success('interrupt succeeded');
      if (status !== STATUS_TYPE.ACTIVE_INTERRUPT) {
        this.$emit('onMessage', status);
      }
    },
    async handleTrain() {
      if (this.disabled) return;
      this.disabled = true;
      const info = this.handleParams();
      const result = await updateTrain({ info, train_mode: this.train_mode }).catch((err) => {
        this.$message.error(err || 'train failed');
        this.disabled = false;
      });
      if (!result) return;
      const { sn } = result;

      this.snStore.setTrainSnSn(sn);
      this.getTrainStatus();
    },
    // 轮询获取进度
    async getTrainStatus() {
      const result = await getTrainStatus({ sn: this.snStore.train_sn }).catch(() => {
        this.$message.error('get training progress failed');
      });
      if (!result) return;
      const { progress, status } = result;
      // 定时轮询 1s
      if (progress < 100) {
        this.timer = setTimeout(() => this.getTrainStatus(), 5000);
        this.progress = progress;
      } else {
        if (status === STATUS_TYPE.END) {
          this.$message.success('train succeeded');
        }
        this.disabled = false;
        this.progress = 0;
      }
      this.$emit('onMessage', status);
    },
    handleParams() {
      const {
        isOpenUnetCollapse,
        isOpenTextEncoderCollapse,
        isOpenPluginUnetCollapse,
        isOpenPluginTeCollapse,
        isOpenLoraUnetCollapse,
        isOpenDataCollapse,
        isOpenLoraTextEncoderCollapse
      } = this;
      const params = JSON.parse(JSON.stringify(this.params));
      if (!isOpenUnetCollapse) {
        params.unet = null;
      }
      if (!isOpenTextEncoderCollapse) {
        params.text_encoder = null;
      }
      if (!isOpenPluginUnetCollapse) {
        params.plugin_unet = null;
      }
      if (!isOpenPluginTeCollapse) {
        params.plugin_TE = null;
      }
      if (!isOpenLoraUnetCollapse) {
        params.lora_unet = null;
      }
      if (!isOpenDataCollapse) {
        params.data = null;
      }
      if (!isOpenLoraTextEncoderCollapse) {
        params.lora_text_encoder = null;
      }
      return params;
    },
    confirmChangeSchedulerKwargs(value, key) {
      this.$set(this.params.train[key], 'scheduler_kwargs', value);
    },
    confirmChangeOptimizerKwargs(value, key) {
      this.$set(this.params.train, key, value);
    },
    dataSourceName(dataset) {
      const length = this.dataSourceList(dataset).length;
      return `data_source${length + 1}`;
    },
    addUnetLayers(unet_index) {
      this.params.unet[unet_index].layers.push(
        JSON.parse(JSON.stringify(default_train_data.unet[0].layers[0]))
      );
    },
    deleteUnetLayers(unet_index, index) {
      this.params.unet[unet_index].layers.splice(index, 1);
    },
    addLogger() {
      this.params.logger.push(JSON.parse(JSON.stringify(default_train_data.logger[0])));
      this.$forceUpdate();
    },
    deleteLogger(index) {
      this.params.logger.splice(index, 1);
      this.$forceUpdate();
    },
    addDataSourceData_source(dataset) {
      if (!this.params.data[dataset].source) {
        this.$set(this.params.data[dataset], 'source', {});
      }
      this.$set(
        this.params.data[dataset].source,
        this.dataSourceName(dataset),
        JSON.parse(JSON.stringify(default_train_data.data.dataset1.source.data_source1))
      );
      this.$forceUpdate();
    },
    deleteDataSourceData_source(dataset, source) {
      this.$delete(this.params.data[dataset].source, source);
      this.$forceUpdate();
    },
    async initDefaultData() {
      const result = await getTrain(this.snStore.train_sn).catch((err) => {
        this.$message.error(err);
      });
      if (!result) return;
      const { info, is_pending, progress, pretrained_mode = [], server_yaml_file = [] } = result;
      const newInfo = JSON.parse(JSON.stringify(info));
      this.$set(this, 'params', JSON.parse(JSON.stringify(default_train_data)));
      this.$set(this, 'params', merge(this.params, info));
      if (!isEmpty(info)) {
        const { unet, text_encoder, plugin_unet, plugin_TE, lora_unet, data, lora_text_encoder } =
          newInfo;
        this.isOpenUnetCollapse = !!unet;
        this.isOpenTextEncoderCollapse = !!text_encoder;
        this.isOpenPluginUnetCollapse = !!plugin_unet;
        this.isOpenPluginTeCollapse = !!plugin_TE;
        this.isOpenLoraUnetCollapse = !!lora_unet;
        this.isOpenDataCollapse = !!data;
        this.isOpenLoraTextEncoderCollapse = !!lora_text_encoder;
        this.initDataTransforms(newInfo);
      }
      if (Object.keys(info).length) {
        const { train } = info;
        const { loss } = train || {};
        this.lossConfig =
          loss && loss.criterion ? loss.criterion._target_ : 'hcpdiff.loss.MinSNRLoss';
      } else {
        this.lossConfig = 'hcpdiff.loss.MinSNRLoss';
      }
      this.disabled = is_pending;
      this.progress = progress;
      if (is_pending) {
        this.getTrainStatus();
      }
      this.$emit('getPretrainedMode', {
        options: handleOptions(pretrained_mode),
        server_yaml_file,
        files: 'train_server_yaml_file_options',
        valueFiles: 'train_yaml_template_sn'
      });
    },
    initDataTransforms(newInfo) {
      if (!isEmpty(newInfo.data)) return;
      Object.keys(newInfo.data).forEach((dataset) => {
        const { source } = newInfo.data[dataset];
        Object.keys(source).forEach((sourceName) => {
          const { image_transforms, tag_transforms } = source[sourceName];
          // image_transforms 存在 transforms存在或长度为0
          if (
            !image_transforms ||
            !image_transforms.transforms ||
            image_transforms.transforms.length === 0
          ) {
            this.$set(this.params.data[dataset].source[sourceName], 'image_transforms', {
              _target_: 'torchvision.transforms.Compose',
              transforms: [
                {
                  _target_: 'torchvision.transforms.ToTensor'
                }
              ]
            });
          }

          // tag_transforms 存在 tag_transforms存在或长度为0
          if (
            !tag_transforms ||
            !tag_transforms.transforms ||
            tag_transforms.transforms.length === 0
          ) {
            this.$set(this.params.data[dataset].source[sourceName], 'tag_transforms', {
              _target_: 'torchvision.transforms.Compose',
              transforms: [
                {
                  _target_: 'hcpdiff.utils.caption_tools.TagShuffle'
                }
              ]
            });
          }
        });
      });
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs .el-tabs__header .el-tabs__item {
  padding: 0 10px !important;
}

.train-wrapper {
  width: 100%;
  height: 100%;
  @include flexLayout(row, 0);
  .train-left {
    flex: 1.5;
    padding: 20px;
    box-sizing: border-box;
    .outerWrapperShadow + .outerWrapperShadow {
      margin-top: 20px;
    }
    .el-radio + .el-radio {
      margin-top: 14px;
    }
    .interrupt-btn {
      width: 100%;
      height: 100%;
      border: 1px solid #b9c0cb !important;
      color: #3b414f !important;
      background: #b9c0cb !important;
    }
    .el-progress {
      width: 100%;
    }
  }
  .train-right {
    height: 100%;
    flex: 5;
    padding: 20px;
    box-sizing: border-box;
    .el-tabs {
      height: 100%;
      border-radius: 10px;
      @include flexLayout(column, 0);
      .el-tabs__nav {
        display: flex;
        flex-wrap: wrap;
      }
      ::v-deep .el-tabs__content {
        flex: 1;
        overflow-y: scroll;
        height: 100%;
        .el-tab-pane {
          min-height: 100%;
        }
        .el-collapse-item__wrap {
          border-radius: 0 0 10px 10px;
          overflow: inherit !important;
        }
      }
    }
  }
}
.outerWrapperShadow-other {
  @include flexLayout(column, 0, center, center);
}
</style>
