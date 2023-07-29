<template>
  <div class="home-wrapper">
    <div class="nav-wrap">
      <div class="config-row change-item">
        <HConfigSelect
          class="select"
          label="pretrained_model :"
          showRefresh
          tooltip="pretrained_model"
          :loading="loading"
          :options="options"
          v-model="pretrained_model"
          @refresh="handleRefresh"
          style="margin-right: 10px"
        />
      </div>
      <div
        class="nav-item"
        v-for="nav in navs"
        :key="nav.key"
        :class="activeName === nav.value && 'is-active'"
        @click="handleNavClick(nav)"
      >
        <div class="nav-item-wrap">
          <i :class="['nav-item-icon', nav.icon]"></i>
          <span class="nav-item-label">{{ nav.label }}</span>
        </div>
      </div>
    </div>
    <div class="config-wrap">
      <div class="config-wrap-scroll">
        <HGenerate
          class="generate-block"
          v-show="activeName === 'generate'"
          ref="generateComponent"
          :pretrained_model="pretrained_model"
          :yaml_template_sn="generate_yaml_template_sn"
          @getPretrainedMode="getPretrainedMode"
          @onMessage="handlerErrorMessage"
        >
          <template v-slot:changeModel>
            <div class="config-row change-item yaml-item">
              <HConfigSelect
                class="select"
                label="yaml_template :"
                tooltip="yaml_template"
                :loading="yaml_template_loading"
                :options="generate_server_yaml_file_options"
                v-model="generate_yaml_template_sn"
              >
                <template>
                  <el-button
                    class="rest-btn"
                    type="primary"
                    size="mini"
                    @click="handleRefreshYamlTemplate('generate_yaml_template_sn')"
                  >
                    reset
                  </el-button>
                </template>
              </HConfigSelect>
            </div>
          </template>
        </HGenerate>
        <HTtain
          ref="trainComponent"
          v-show="activeName === 'train'"
          :yaml_template_sn="train_yaml_template_sn"
          @getPretrainedMode="getPretrainedMode"
          @onMessage="handlerErrorMessage"
        >
          <template v-slot:changeModel>
            <div class="config-row change-item yaml-item">
              <HConfigSelect
                class="select"
                tooltip="yaml_template"
                label="yaml_template :"
                :loading="yaml_template_loading"
                :options="train_server_yaml_file_options"
                v-model="train_yaml_template_sn"
              >
                <template>
                  <el-button
                    class="rest-btn"
                    type="primary"
                    size="mini"
                    @click="handleRefreshYamlTemplate('train_yaml_template_sn')"
                    style="margin-left: 10px"
                  >
                    reset
                  </el-button>
                </template>
              </HConfigSelect>
            </div>
          </template>
        </HTtain>
        <HDataset v-show="activeName === 'dataset'" :model="pretrained_model" />
        <HPt v-show="activeName === 'pt'" :pretrained_model="pretrained_model" />
      </div>
    </div>
  </div>
</template>
<script>
import HGenerate from './generate/index.vue';
import HTtain from './train/index.vue';
import HDataset from './dataset/index.vue';
import HPt from './pt/index.vue';

import { getGenerateDir } from '@/api/file';
import { handleOptions } from '@/utils/index';
import useSnStore from '@/store/snStore';
import copy from 'copy-to-clipboard';
import { STATUS_TYPE } from '@/constants/index';

export default {
  name: 'IndexH',
  components: {
    HGenerate,
    HTtain,
    HDataset,
    HPt
  },
  data() {
    return {
      navs: [
        { label: 'generate', value: 'generate', icon: 'el-icon-s-opportunity' },
        { label: 'create word pt', value: 'pt', icon: 'el-icon-s-opportunity' },
        { label: 'generate dataset', value: 'dataset', icon: 'el-icon-s-opportunity' },
        { label: 'train', value: 'train', icon: 'el-icon-s-opportunity' }
      ],
      activeName: 'train',
      pretrained_model: '',
      options: [],
      loading: false,
      yaml_template_loading: false,

      generate_server_yaml_file_options: [],
      generate_yaml_template_sn: '',
      train_server_yaml_file_options: [],
      train_yaml_template_sn: ''
    };
  },
  setup() {
    const snStore = useSnStore();
    return { snStore };
  },
  created() {
    this.generate_yaml_template_sn = this.snStore.generate_sn;
    this.train_yaml_template_sn = this.snStore.train_sn;
    this.activeName = this.$route.query.activeName || 'generate';
  },
  methods: {
    copyText(txt) {
      copy(txt);
      this.$message.success(`复制成功：${txt}`);
    },
    handleNavClick(nav) {
      this.activeName = nav.value;
      if (nav.value === this.$route.query.activeName) return;
      // 设置url query参数
      this.$router.push({
        query: {
          activeName: nav.value
        }
      });
    },

    handleRefresh() {
      this.loading = true;
      getGenerateDir({ path: 'pretrained_mode' })
        .then((res) => {
          if (!res) return;
          this.options = handleOptions(res.files);
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
    },
    getPretrainedMode({ options, pretrained_model, server_yaml_file, files, valueFiles }) {
      this.options = options;
      this.pretrained_model = pretrained_model || this.pretrained_model;
      this[files] = server_yaml_file.map((item) => {
        return {
          label: item.label,
          value: item.value || '-1'
        };
      });
      if (!this[valueFiles]) {
        this[valueFiles] = server_yaml_file[0].value;
      }
    },
    handleRefreshYamlTemplate(files) {
      const { activeName } = this;
      const ySn = this[files] === '-1' ? '' : this[files];
      if (activeName === 'generate') {
        this.snStore.setGenerateSnSn(ySn);
        this.$refs.generateComponent.initDefaultData();
      }
      if (activeName === 'train') {
        this.snStore.setTrainSnSn(ySn);
        this.$refs.trainComponent.initDefaultData();
      }
    },

    handlerErrorMessage(status) {
      const { UNACTIVE_INTERRUPT, DELETE_OR_NOT_EXIST } = STATUS_TYPE;
      switch (status) {
        case UNACTIVE_INTERRUPT:
          this.$message.error('执行失败');
          break;
        case DELETE_OR_NOT_EXIST:
          this.$message.error('任务不存在或被删除');
          break;
      }
    }
  }
};
</script>
<style lang="scss">
.home-wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
  @include flexLayout(row, 0);
  .nav-wrap {
    width: 240px;
    min-width: 240px;
    background-color: #eff2f7;
    @include block-shadow();
    @include flexLayout(column, 6px);
    justify-content: center;
    position: relative;
    .nav-item {
      height: 50px;
      line-height: 50px;
      padding-left: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      color: #666;
      overflow: hidden;
      &-label {
        font-size: 18px;
      }
      &-icon {
        font-size: 24px;
        margin-right: 10px;
      }
      .nav-item-wrap {
        position: relative;
        transition: all 0.2s ease-in-out;
      }
      &:hover {
        background-color: #e4e7ed;
        .nav-item-wrap {
          transform: translateX(14px);
        }
      }
      &.is-active {
        color: #070707;
        .nav-item-wrap {
          transform: translateX(14px);
        }
      }
    }
    .change-item {
      position: absolute;
      top: 10px;
      left: 10px;
    }
  }
  .config-wrap {
    flex: 1;
    min-width: 1000px;
    height: 100%;
    overflow-y: scroll;
    &-scroll {
      min-width: 1250px;
      width: auto;
      height: 100%;
      .generate-block {
        .btn-and-config {
          gap: 0;
        }
        .change-item {
          margin-top: 0;
          margin-right: 10px;
          .rest-btn {
            margin-left: 10px;
          }
          &.yaml-item {
            margin: 0px 0 10px;
          }
        }
      }
    }
  }
}
</style>
