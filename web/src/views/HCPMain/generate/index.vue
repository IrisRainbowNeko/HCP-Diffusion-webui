<template>
  <div class="txt-img-wrapper">
    <div class="row-top">
      <h-preview-img :imgs="imgs" :progress="progress"></h-preview-img>
      <div class="btn-and-config">
        <h-block class="outerWrapperShadow prompt">
          <el-input
            type="textarea"
            placeholder="Prompt"
            v-model="config.prompt"
            maxlength="1500"
            show-word-limit
            autofocus
            :autosize="{ minRows: 6, maxRows: 6 }"
          ></el-input>
          <el-input
            type="textarea"
            placeholder="Negative prompt"
            v-model="config.neg_prompt"
            maxlength="1500"
            show-word-limit
            :autosize="{ minRows: 6, maxRows: 6 }"
          ></el-input>
        </h-block>
      </div>
      <div class="btn-and-config">
        <h-block
          class="outerWrapperShadow"
          style="height: auto; flex: initial; padding: 10px 5px 10px"
        >
          <slot name="changeModel"></slot>
        </h-block>
        <h-block class="outerWrapperShadow" style="margin-bottom: 0; flex: initial">
          <div class="generate-box">
            <el-button
              class="primary-btn"
              type="primary"
              @click="handleGenerate"
              v-show="status !== STATUS.LOADING"
            >
              Generate
            </el-button>
            <div class="generate-box-btns" v-show="status === STATUS.LOADING">
              <!-- 中断 -->
              <el-button type="text" @click="handleInterrupt">Interrupt</el-button>
            </div>
          </div>
          <div class="config-row">
            <el-checkbox v-model="config.save.save_cfg">save_cfg</el-checkbox>
          </div>
          <div class="config-row">
            <HConfigSelect
              tooltip="generate.save.image_type"
              label="image_type"
              :options="image_typ_options"
              v-model="config.save.image_type"
              style="font-size: 13px"
            />
            <HConfigInputNumber
              label="quality"
              tooltip="generate.save.quality"
              :min="1"
              :max="100"
              :step="1"
              v-model="config.save.quality"
              style="font-size: 13px"
            />
          </div>
        </h-block>
      </div>
    </div>
    <div class="row-bottom">
      <div class="config-main">
        <div class="config-item">
          <div class="config-item-scroll-wrap">
            <!-- 取样方法配置 -->
            <OtherConfig />
            <!-- infer_args -->
            <InferArgsConfig ref="inferArgsComponent" />
          </div>
        </div>
        <div class="config-item">
          <div class="config-item-scroll-wrap">
            <!-- offload -->
            <OffloadConfig v-model="isOpenOffload" />

            <!-- condition -->
            <ConditionConfig v-model="isOpenConditionConfig" />

            <!-- ex_input -->
            <EXInputConfig v-model="isOpenEXInput" />

            <!-- new_components -->
            <NewComponentsConfig ref="newComponentComponent" />
          </div>
        </div>
        <div class="config-item">
          <div class="config-item-scroll-wrap">
            <!-- merge -->
            <MergeConfig v-model="isOpenMergeConfig" ref="mergeComponent" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { default_generate_data, image_typ_options, STATUS_TYPE } from '@/constants/index';
import {
  generateAction,
  getGenerateProgress,
  stopGenerate,
  getGenerateConfig
} from '@/api/generate';
import { watch } from 'vue';
import OtherConfig from './components/otherConfig.vue';
import ConditionConfig from './components/conditionConfig.vue';
import EXInputConfig from './components/exInputConfig.vue';
import OffloadConfig from './components/offloadConfig.vue';
import InferArgsConfig from './components/inferArgsConfig.vue';
import NewComponentsConfig from './components/newComponentsConfig.vue';
import MergeConfig from './components/mergeConfig.vue';
import { validateParams } from '@/utils/index';
import { merge, cloneDeep, isNil, isEmpty } from 'lodash-es';
import { storeToRefs } from 'pinia';
import useCommonStore from '@/store/commonStore';
import useSnStore from '@/store/snStore';
import useGenerateStore from '@/store/generateStore';
const STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success'
};

export default {
  name: 'TxtImg',
  components: {
    OtherConfig,
    ConditionConfig,
    EXInputConfig,
    OffloadConfig,
    InferArgsConfig,
    NewComponentsConfig,
    MergeConfig
  },
  props: {
    pretrained_model: {
      type: String,
      default: ''
    },
    yaml_template_sn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      status: STATUS.SUCCESS,
      STATUS,
      image_typ_options,
      imgs: [],
      progress: 0,
      timer: null,
      isOpenMergeConfig: false,
      isOpenConditionConfig: false,
      isOpenEXInput: false,
      isOpenOffload: false
    };
  },
  setup() {
    const commonStore = useCommonStore();
    const snStore = useSnStore();
    const generateStore = useGenerateStore();
    const { generate } = storeToRefs(generateStore);
    // 任意更新储存到localstorage
    watch(generate, (state) => generateStore.storageGenerate(state), { deep: true });
    return { commonStore, snStore, generateStore, config: generate };
  },
  watch: {
    pretrained_model: {
      handler: function (val) {
        this.config.pretrained_model = val;
      },
      immediate: true
    }
  },
  mounted() {
    // if (!this.generateStore.storedGenerate) {
    this.initDefaultData();
    // } else {
    // this.initDefaultView(this.generateStore.storedGenerate);
    // }
  },
  methods: {
    async handleGenerate() {
      if (!this.validate()) return;
      this.status = 'loading';
      this.imgs = [];
      const result = await generateAction({
        info: { ...this.config, pretrained_model: this.pretrained_model }
      }).catch((err) => {
        this.$message.error(err || 'generate failed');
        this.status = STATUS.SUCCESS;
      });
      if (!result) return;
      const { sn } = result;
      this.snStore.setGenerateSnSn(sn);
      this.getProgress();
    },
    // 中断
    async handleInterrupt() {
      const result = await stopGenerate(this.snStore.generateSn).catch(() => {
        this.$message.error('interrupt failure');
      });
      if (!result) return;
      const { status } = result;
      this.status = STATUS.SUCCESS;
      this.progress = 0;
      this.timer && clearTimeout(this.timer);
      // 清空
      this.imgs = [];
      this.$message.success('interrupt success');
      if (status !== STATUS_TYPE.ACTIVE_INTERRUPT) {
        this.$emit('onMessage', status);
      }
    },
    // 轮询获取进度
    async getProgress() {
      const result = await getGenerateProgress(this.snStore.generateSn).catch(() => {
        this.$message.error('fetch generate progress failed');
      });
      if (!result) return;
      const { progress, sn, images = [], status } = result;
      // 定时轮询 1s
      if (progress < 100) {
        this.timer = setTimeout(() => this.getProgress(), 2000);
        this.progress = progress;
      } else {
        if (status === STATUS_TYPE.END) {
          this.$message.success('generate succeeded');
        }
        this.status = STATUS.SUCCESS;
        this.imgs = images;
        this.progress = 0;
        this.snStore.setGenerateSnSn(sn);
      }
      this.$emit('onMessage', status);
    },

    async initDefaultData() {
      const result = await getGenerateConfig(this.snStore.generateSn).catch(() => {
        this.$message.error('fetch setting failed');
      });
      if (!result) return;

      const {
        pretrained_mode = [],
        server_yaml_file = [],
        merge_group_lora_path = [],
        merge_group_part_path = [],
        merge_group_plugin_controlnet1_path = [],
        pretrained_model_name_or_path = []
      } = result;

      this.generateStore.generate_server_yaml_file = server_yaml_file;
      this.generateStore.merge_group_lora_path = merge_group_lora_path;
      this.generateStore.merge_group_part_path = merge_group_part_path;
      this.generateStore.merge_group_plugin_controlnet1_path = merge_group_plugin_controlnet1_path;
      this.generateStore.pretrained_model_name_or_path = pretrained_model_name_or_path;
      this.commonStore.pretrained_model = pretrained_mode;

      const { sn, info, is_pending, progress, images = [] } = result;
      this.snStore.setGenerateSnSn(sn);
      if (images.length) {
        this.imgs = images;
      }
      if (is_pending) {
        this.status = STATUS.LOADING;
        this.progress = progress;
        this.getProgress();
      }

      const newInfo = merge(cloneDeep(default_generate_data), info);
      // 保留模型
      newInfo.pretrained_model = this.config.pretrained_model;

      this.$refs.inferArgsComponent.initDefaultData(newInfo);
      this.$refs.newComponentComponent.initDefaultData(newInfo);
      this.$refs.mergeComponent.initDefaultData(newInfo);

      this.initDefaultView(newInfo);
    },

    initDefaultView(info) {
      // 控制开关
      const { condition, ex_input, merge, offload } = info;
      this.isOpenConditionConfig = !isNil(condition) && !isEmpty(condition);
      this.isOpenEXInput = !isNil(ex_input) && !isEmpty(ex_input);
      this.isOpenMergeConfig = !isNil(merge) && !isEmpty(merge);
      this.isOpenOffload = !isNil(offload) && !isEmpty(offload);
      // 先打开折叠再更新数据，否则将不会渲染页面。
      this.$nextTick(() => {
        // 触发全局相应
        this.config = { ...info };
      });
    },

    // 校验参数
    validate() {
      const self = this;
      const params = cloneDeep(this.config);
      const requiredField = {
        'condition.image': {
          // 可自定义
          validate: (val) => {
            if (!self.isOpenConditionConfig) return true;
            return !['', undefined, null].includes(val);
          },
          message: 'condition image is required'
        },
        'ex_input.cond.image': {
          // 可自定义
          validate: (val) => {
            if (!self.isOpenEXInput) return true;
            return !['', undefined, null].includes(val);
          },
          message: 'ex_input image is required'
        },
        'merge.*.lora.*.path': {
          validate: (val) => {
            if (!self.isOpenMergeConfig) return true;
            return !['', undefined, null].includes(val);
          },
          message: 'merge.*.lora.*.path is required'
        },
        'merge.*.part.*.path': {
          validate: (val) => {
            if (!self.isOpenMergeConfig) return true;
            return !['', undefined, null].includes(val);
          },
          message: 'merge.*.part.*.path is required'
        },
        'merge.*.plugin.*.path': {
          validate: (val) => {
            if (!self.isOpenMergeConfig) return true;
            return !['', undefined, null].includes(val);
          },
          message: 'merge.*.plugin.*.path is required'
        },
        'new_components.vae._target_': {
          message: 'new_components.vae._target_ is required'
        }
      };
      return validateParams(requiredField, params);
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  }
};
</script>
<style lang="scss" scoped>
.outerWrapperShadow {
  &.prompt {
    margin-bottom: 0;
    @include flexLayout(column, 20px, space-between, center);
  }
}

.txt-img-wrapper {
  width: 100%;
  height: 100%;
  @include flexLayout(column, 0);
  .row-top {
    width: 100%;
    height: 340px;
    @include flexLayout(row, 20px);
    padding: 20px 20px 14px;
    box-sizing: border-box;
    .btn-and-config {
      flex: 3;
      height: 100%;
      background-color: #fff;
      @include border-radius();
      @include flexLayout(column);
      justify-content: space-between;
      &.prompt {
        margin-bottom: 0;
      }
      .generate-box {
        height: 72px;
        &-btns {
          display: flex;
          height: 100%;
          .el-button {
            flex: 1;
            height: 100%;
            border: 1px solid #b9c0cb;
            color: #3b414f;
            background: #b9c0cb;
            @include blockShadow();
            &:hover {
              background: #a6abb3;
              border: 1px solid #a6abb3;
            }
          }
          & > :nth-of-type(1) {
            border-radius: 4px 0 0 4px;
          }
        }
      }
    }
  }
  .row-bottom {
    flex: 1;
    overflow-y: scroll;
    padding: 4px 0px 10px 0px;
    overflow: hidden;
    .config-main {
      height: 100%;
      @include flexLayout(row, 0);
      overflow: hidden;
      .config-item {
        flex: 1;
        width: 100%;
        overflow-y: scroll;
        padding: 10px 20px;
        box-sizing: border-box;
        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
          background-color: transparent;
        }
        // 滚动条轨道
        &::-webkit-scrollbar-track {
          // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
          background-color: transparent;
        }
        &-scroll-wrap {
          width: 100%;
          @include flexLayout(column, 20px);
        }
      }
    }
  }
}
</style>
