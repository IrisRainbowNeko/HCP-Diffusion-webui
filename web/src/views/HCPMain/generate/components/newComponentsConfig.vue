<template>
  <h-collapse
    title="New_components Config"
    showEditYaml
    :config="config"
    @confirm="(value) => $set(config, 'new_components', value)"
  >
    <template v-if="keyLength">
      <!-- scheduler -->
      <HBlock
        label="scheduler"
        tooltip="generate.new_components.schedulerTip"
        :h-index="2"
        showEditYaml
        :config="config.new_components.scheduler"
        @confirm="(value) => this.$set(this.config.new_components, 'scheduler', value)"
      >
        <div class="config-row">
          <HConfigSelect
            label="type"
            tooltip="generate.new_components.scheduler._target_"
            :options="scheduler_options"
            v-model="config.new_components.scheduler._target_"
          />
          <HConfigInput
            label="beta_schedule"
            tooltip="generate.new_components.scheduler.beta_schedule"
            v-model="config.new_components.scheduler.beta_schedule"
          />
        </div>
        <div class="config-row">
          <HConfigInputNumber
            label="beta_start"
            tooltip="generate.new_components.scheduler.beta_start"
            :min="0"
            :max="1"
            :step="0.00001"
            v-model="config.new_components.scheduler.beta_start"
          />
          <HConfigInputNumber
            label="beta_end"
            tooltip="generate.new_components.scheduler.beta_end"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="config.new_components.scheduler.beta_end"
          />
        </div>
        <div class="config-row">
          <el-checkbox
            v-if="has_karras"
            v-model="config.new_components.scheduler.use_karras_sigmas"
          >
            use_karras_sigmas
          </el-checkbox>

          <el-checkbox v-if="is_dpm" v-model="config.new_components.scheduler.lower_order_final">
            lower_order_final
          </el-checkbox>
        </div>
        <HConfigSelect
          v-if="is_dpm"
          label="algorithm_type"
          tooltip="generate.new_components.scheduler.algorithm_type"
          :options="dpm_type_options"
          v-model="config.new_components.scheduler.algorithm_type"
        />
      </HBlock>
      <!-- vae -->
      <HBlock
        label="vae"
        tooltip="generate.new_components.vaeTip"
        :h-index="2"
        showSwitch
        v-model="isOpenNewComponentsVaeConfig"
        showEditYaml
        :config="config.new_components.vae"
        @confirm="(value) => this.$set(this.config.new_components, 'vae', value)"
      >
        <div class="config-row" v-if="config.new_components.vae">
          <HConfigInput
            label="_target_"
            tooltip="generate.new_components.vae._target_"
            required
            v-model="config.new_components.vae._target_"
          />
          <HConfigSelect
            label="pretrained_model_name_or_path"
            tooltip="generate.new_components.vae.pretrained_model_name_or_path"
            :options="pretrained_model_name_or_path_options"
            v-model="config.new_components.vae.pretrained_model_name_or_path"
          />
        </div>
      </HBlock>
    </template>
  </h-collapse>
</template>
<script>
import {
  default_generate_data,
  scheduler_options,
  dpm_type_options,
  dmp_schedulers,
  karras_schedulers
} from '@/constants/index';
import { storeToRefs } from 'pinia';
import useGenerateStore from '@/store/generateStore';
import { cloneDeep, isNil } from 'lodash-es';
export default {
  name: 'NewComponentsConfig',
  props: {
    pretrained_model_name_or_path_options: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const generateStore = useGenerateStore();
    const { generate } = storeToRefs(generateStore);
    return { generateStore, config: generate };
  },
  data() {
    return {
      scheduler_options,
      dpm_type_options,

      isOpenNewComponentsVaeConfig: true,

      // 备份 params.new_components
      cacheConfig: cloneDeep(default_generate_data.new_components),
      initNewComponentsVae: cloneDeep(default_generate_data.new_components.vae)
    };
  },
  computed: {
    keyLength() {
      return Object.keys(this.config.new_components).length;
    },
    has_karras() {
      return this.hasKarras(this.config);
    },
    is_dpm() {
      return this.isDpm(this.config);
    }
  },
  watch: {
    // params.new_components.vae 开关
    isOpenNewComponentsVaeConfig: {
      handler: function (val) {
        if (val) {
          this.config.new_components.vae = cloneDeep(
            this.initNewComponentsVae || default_generate_data.new_components.vae
          );
        } else {
          if (!this.config.new_components.vae) return;
          this.initNewComponentsVae = cloneDeep(this.config.new_components.vae);
          this.config.new_components.vae = null;
        }
      },
      immediate: true
    },
    'config.new_components.scheduler._target_': {
      handler: function () {
        this.handleScheduler(this.config);
      },
      immediate: true
    }
  },
  methods: {
    initDefaultData(newInfo) {
      this.handleScheduler(newInfo);
    },
    hasKarras(info) {
      return (
        'scheduler' in info.new_components &&
        karras_schedulers.includes(info.new_components.scheduler._target_)
      );
    },
    isDpm(info) {
      return (
        'scheduler' in info.new_components &&
        dmp_schedulers.includes(info.new_components.scheduler._target_)
      );
    },
    handleScheduler(info) {
      const scheduler = info.new_components.scheduler;
      if (this.isDpm(info)) {
        if (isNil(scheduler.lower_order_final)) this.$set(scheduler, 'lower_order_final', true);
        if (isNil(scheduler.algorithm_type)) this.$set(scheduler, 'algorithm_type', '');
      } else {
        if (!isNil(scheduler.lower_order_final)) this.$delete(scheduler, 'lower_order_final');
        if (!isNil(scheduler.algorithm_type)) this.$delete(scheduler, 'algorithm_type');
      }

      if (this.hasKarras(info)) {
        if (isNil(scheduler.use_karras_sigmas)) this.$set(scheduler, 'use_karras_sigmas', false);
      } else {
        if (!isNil(scheduler.use_karras_sigmas)) this.$delete(scheduler, 'use_karras_sigmas');
      }
    }
  }
};
</script>
<style lang=""></style>
