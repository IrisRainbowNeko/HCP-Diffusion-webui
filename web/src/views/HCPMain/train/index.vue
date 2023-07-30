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
            v-model="config.exp_dir"
          />
        </div>
        <div class="config-row">
          <HConfigSelect
            label="mixed_precision"
            style="font-size: 13px"
            :options="dtype_options"
            tooltip="train.mixed_precision"
            v-model="config.mixed_precision"
          />
        </div>
        <div class="config-row">
          <HConfigInputNumber
            tooltip="train.seed"
            label="seed"
            style="font-size: 13px"
            :min="1"
            v-model="config.seed"
          />
        </div>
        <div class="config-row">
          <HConfigSelect
            label="ckpt_type"
            tooltip="train.ckpt_type"
            style="font-size: 13px"
            :options="ckpt_type_options"
            v-model="config.ckpt_type"
          />
        </div>
        <div class="config-row">
          <el-checkbox v-model="config.allow_tf32">allow_tf32</el-checkbox>
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
          <ModelConfig />
        </el-tab-pane>
        <!-- tokenizer_pt -->
        <el-tab-pane label="tokenizer_pt" name="tokenizer_pt">
          <TokenizerPtConfig :tokenizer_pt_train_name_options="tokenizer_pt_train_name_options" />
        </el-tab-pane>
        <!-- train -->
        <el-tab-pane label="train" name="train">
          <TrainConfig />
        </el-tab-pane>
        <!-- unet -->
        <el-tab-pane label="unet" name="unet">
          <UnetConfig v-model="isOpenUnetCollapse" />
        </el-tab-pane>
        <!-- text_encoder -->
        <el-tab-pane label="text_encoder" name="text_encoder">
          <TextEncoderConfig v-model="isOpenTextEncoderCollapse" />
        </el-tab-pane>
        <!-- lora_unet -->
        <el-tab-pane label="lora_unet" name="lora_unet">
          <LoraUnetConfig v-model="isOpenLoraUnetCollapse" />
        </el-tab-pane>
        <!-- lora_text_encoder -->
        <el-tab-pane label="lora_text_encoder" name="lora_text_encoder">
          <LoraTextEncoderConfig v-model="isOpenLoraTextEncoderCollapse" />
        </el-tab-pane>
        <!-- plugin_unet -->
        <el-tab-pane label="plugin_unet" name="plugin_unet">
          <PluginUnetConfig v-model="isOpenPluginUnetCollapse" />
        </el-tab-pane>
        <!-- plugin_TE -->
        <el-tab-pane label="plugin_TE" name="plugin_TE">
          <PluginTEConfig v-model="isOpenPluginTeCollapse" />
        </el-tab-pane>
        <!-- data -->
        <el-tab-pane label="data" name="data">
          <DataConfig ref="dataComponent" :tab-height="tabHeight" />
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
  STATUS_TYPE
} from '@/constants/index';
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { getTrain, updateTrain, getTrainStatus, stopTrain } from '@/api/train';
import { handleOptions } from '@/utils/index';
import { merge, isNil, isEmpty, cloneDeep } from 'lodash-es';
import useSnStore from '@/store/snStore';
import useTrainStore from '@/store/trainStore';
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
      dtype_options,
      params: cloneDeep(default_train_data),
      disabled: false,
      progress: 0,
      timer: null,
      // 训练类型
      train_mode: 1,
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
    const trainStore = useTrainStore();
    const { train } = storeToRefs(trainStore);
    // 任意更新储存到localstorage
    watch(train, (state) => trainStore.storageTrain(state), { deep: true });
    return { snStore, trainStore, config: train };
  },
  mounted() {
    // if (!this.trainStore.storedTrain) {
    this.initDefaultData();
    // } else {
    // this.initDefaultView(this.trainStore.storedTrain);
    // }
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
      const result = await updateTrain({ config: this.config, train_mode: this.train_mode }).catch(
        (err) => {
          this.$message.error(err || 'train failed');
          this.disabled = false;
        }
      );
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
    dataSourceName(dataset) {
      const length = this.dataSourceList(dataset).length;
      return `data_source${length + 1}`;
    },
    async initDefaultData() {
      const result = await getTrain(this.snStore.train_sn).catch((err) => {
        this.$message.error(err);
      });
      if (!result) return;

      const { pretrained_model_name_or_path = [], tokenizer_pt_train_name = [] } = result;
      this.trainStore.pretrained_model_name_or_path_options = handleOptions(
        pretrained_model_name_or_path
      );
      this.trainStore.tokenizer_pt_train_name_options = handleOptions(tokenizer_pt_train_name);

      const { info, is_pending, progress, pretrained_mode = [], server_yaml_file = [] } = result;
      const newInfo = merge(cloneDeep(default_train_data), info);
      if (!isEmpty(info)) {
        this.$refs.dataComponent.initDefaultData(newInfo);
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

      newInfo.pretrained_model = this.config.pretrained_model;
      this.initDefaultView(newInfo);
    },
    initDefaultView(info) {
      const { unet, text_encoder, plugin_unet, plugin_TE, lora_unet, data, lora_text_encoder } =
        info;
      // 控制开关
      this.isOpenUnetCollapse = !isNil(unet) && !isEmpty(unet);
      this.isOpenTextEncoderCollapse = !isNil(text_encoder) && !isEmpty(text_encoder);
      this.isOpenPluginUnetCollapse = !isNil(plugin_unet) && !isEmpty(plugin_unet);
      this.isOpenPluginTeCollapse = !isNil(plugin_TE) && !isEmpty(plugin_TE);
      this.isOpenLoraUnetCollapse = !isNil(lora_unet) && !isEmpty(lora_unet);
      this.isOpenDataCollapse = !isNil(data) && !isEmpty(data);
      this.isOpenLoraTextEncoderCollapse = !isNil(lora_text_encoder) && !isEmpty(lora_text_encoder);
      // 先打开折叠再更新数据，否则将不会渲染页面。
      this.$nextTick(() => {
        // 触发全局相应
        this.config = { ...info };
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
