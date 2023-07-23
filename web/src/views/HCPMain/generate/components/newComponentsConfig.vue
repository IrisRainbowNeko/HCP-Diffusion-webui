<template>
  <h-collapse title="New_components Config" showEditYaml :config="config" @confirm="onConfirm">
    <template v-if="keyLength">
      <!-- scheduler -->
      <HBlock
        label="scheduler"
        tooltip="generate.new_components.schedulerTip"
        :h-index="2"
        showEditYaml
        :config="configStore.generate.new_components.scheduler"
        @confirm="
          (value) => this.$set(this.configStore.generate.new_components, 'scheduler', value)
        "
      >
        <div class="config-row">
          <HConfigSelect
            label="type"
            tooltip="generate.new_components.scheduler._target_"
            :options="scheduler_options"
            v-model="configStore.generate.new_components.scheduler._target_"
          />
          <HConfigInput
            label="beta_schedule"
            tooltip="generate.new_components.scheduler.beta_schedule"
            v-model="configStore.generate.new_components.scheduler.beta_schedule"
          />
        </div>
        <div class="config-row">
          <HConfigInputNumber
            label="beta_start"
            tooltip="generate.new_components.scheduler.beta_start"
            :min="0"
            :max="1"
            :step="0.00001"
            v-model="configStore.generate.new_components.scheduler.beta_start"
          />
          <HConfigInputNumber
            label="beta_end"
            tooltip="generate.new_components.scheduler.beta_end"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="configStore.generate.new_components.scheduler.beta_end"
          />
        </div>
        <div class="config-row">
          <el-checkbox
            v-model="configStore.generate.new_components.scheduler.use_karras_sigmas"
            v-if="has_karras"
          >
            use_karras_sigmas
          </el-checkbox>

          <el-checkbox
            v-model="configStore.generate.new_components.scheduler.lower_order_final"
            v-if="is_dpm"
          >
            lower_order_final
          </el-checkbox>
        </div>
        <HConfigSelect
          label="algorithm_type"
          tooltip="generate.new_components.scheduler.algorithm_type"
          :options="dpm_type_options"
          v-model="configStore.generate.new_components.scheduler.algorithm_type"
          v-if="is_dpm"
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
        :config="configStore.generate.new_components.vae"
        @confirm="(value) => this.$set(this.configStore.generate.new_components, 'vae', value)"
      >
        <div class="config-row" v-if="config.vae">
          <HConfigInput
            label="_target_"
            tooltip="generate.new_components.vae._target_"
            required
            v-model="configStore.generate.new_components.vae._target_"
          />
          <HConfigSelect
            label="pretrained_model_name_or_path"
            tooltip="generate.new_components.vae.pretrained_model_name_or_path"
            :options="pretrained_model_name_or_path_options"
            v-model="configStore.generate.new_components.vae.pretrained_model_name_or_path"
          />
        </div>
      </HBlock>
    </template>
  </h-collapse>
</template>
<script>
import {
  default_data,
  scheduler_options,
  dpm_type_options,
  karras_schedulers
} from '@/constants/index';
import useConfigStore from '@/store/configStore';
import { cloneDeep, assign, merge } from 'lodash-es';
export default {
  name: 'NewComponentsConfig',
  props: {
    pretrained_model_name_or_path_options: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const configStore = useConfigStore();
    return { configStore };
  },
  data() {
    return {
      scheduler_options,
      dpm_type_options,

      isOpenNewComponentsVaeConfig: true,

      // 备份 params.new_components
      cacheConfig: cloneDeep(default_data.new_components),
      initNewComponentsVae: cloneDeep(default_data.new_components.vae)
    };
  },
  computed: {
    config() {
      return cloneDeep(this.configStore.generate.new_components);
    },
    keyLength() {
      return Object.keys(this.configStore.generate.new_components).length;
    },
    has_karras() {
      return (
        'scheduler' in this.configStore.generate.new_components &&
        karras_schedulers.includes(this.configStore.generate.new_components.scheduler._target_)
      );
    },
    is_dpm() {
      return (
        'scheduler' in this.configStore.generate.new_components &&
        (this.configStore.generate.new_components.scheduler._target_ ===
          'diffusers.DPMSolverMultistepScheduler' ||
          this.configStore.generate.new_components.scheduler._target_ ===
            'diffusers.DPMSolverSinglestepScheduler')
      );
    }
  },
  watch: {
    // params.new_components.vae 开关
    isOpenNewComponentsVaeConfig: {
      handler: function (val) {
        if (val) {
          this.configStore.generate.new_components.vae = JSON.parse(
            JSON.stringify(this.initNewComponentsVae)
          );
        } else {
          if (!this.configStore.generate.new_components.vae) return;
          this.initNewComponentsVae = cloneDeep(this.configStore.generate.new_components.vae);
          this.configStore.generate.new_components.vae = null;
        }
      },
      immediate: true
    },
    'configStore.generate.new_components.scheduler._target_': {
      handler: function (val) {
        console.log(val);
        if (
          val === 'diffusers.DPMSolverMultistepScheduler' ||
          val === 'diffusers.DPMSolverSinglestepScheduler'
        ) {
          this.configStore.generate.new_components.scheduler.lower_order_final = true;
        } else {
          if ('lower_order_final' in this.configStore.generate.new_components.scheduler) {
            const scheduler = cloneDeep(this.configStore.generate.new_components.scheduler);
            delete scheduler.lower_order_final;
            delete scheduler.algorithm_type;
            this.configStore.generate.new_components = {
              ...this.configStore.generate.new_components,
              scheduler
            };
          }
          if (
            !karras_schedulers.includes(this.configStore.generate.new_components.scheduler._target_)
          ) {
            this.configStore.generate.new_components.scheduler.use_karras_sigmas = null;
          }
        }
      },
      immediate: true
    }
  },
  created() {
    // 备份 params.new_components.vae
    this.initNewComponentsVae = cloneDeep(default_data.new_components.vae);
  },
  methods: {
    initConfig(info) {
      this.configStore.generate.new_components = merge(
        this.configStore.generate.new_components,
        cloneDeep(info.new_components)
      );
      const keysLength = Object.keys(this.configStore.generate.new_components || {}).length;
      this.isOpenNewComponentsVaeConfig =
        keysLength > 0 &&
        Object.keys(this.configStore.generate.new_components.vae || {}).length > 0;
    },
    onConfirm(value) {
      assign(this.configStore.generate.new_components, value);
    }
  }
};
</script>
<style lang=""></style>
