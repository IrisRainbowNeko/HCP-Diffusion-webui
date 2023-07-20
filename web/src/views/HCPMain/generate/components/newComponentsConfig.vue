<template>
  <h-collapse
    title="New_components Config"
    showEditYaml
    :config="config"
    @confirm="
      (value) => {
        this.config = JSON.parse(JSON.stringify(value));
      }
    "
  >
    <template v-if="keyLength">
      <!-- scheduler -->
      <HBlock
        label="scheduler"
        tooltip="generate.new_components.schedulerTip"
        :h-index="2"
        showEditYaml
        :config="config.scheduler"
        @confirm="(value) => this.$set(this.config, 'scheduler', value)"
      >
        <div class="config-row">
          <HConfigSelect
            label="type"
            tooltip="generate.new_components.scheduler._target_"
            :options="scheduler_options"
            v-model="config.scheduler._target_"
          />
          <HConfigInput
            label="beta_schedule"
            tooltip="generate.new_components.scheduler.beta_schedule"
            v-model="config.scheduler.beta_schedule"
          />
        </div>
        <div class="config-row">
          <HConfigInputNumber
            label="beta_start"
            tooltip="generate.new_components.scheduler.beta_start"
            :min="0"
            :max="1"
            :step="0.00001"
            v-model="config.scheduler.beta_start"
          />
          <HConfigInputNumber
            label="beta_end"
            tooltip="generate.new_components.scheduler.beta_end"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="config.scheduler.beta_end"
          />
        </div>
        <div class="config-row">
          <el-checkbox v-model="config.scheduler.use_karras_sigmas" v-if="has_karras">
            use_karras_sigmas
          </el-checkbox>

          <el-checkbox v-model="config.scheduler.lower_order_final" v-if="is_dpm">
            lower_order_final
          </el-checkbox>
        </div>
        <HConfigSelect
          label="algorithm_type"
          tooltip="generate.new_components.scheduler.algorithm_type"
          :options="dpm_type_options"
          v-model="config.scheduler.algorithm_type"
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
        :config="config.vae"
        @confirm="(value) => this.$set(this.config, 'vae', value)"
      >
        <div class="config-row" v-if="config.vae">
          <HConfigInput
            label="_target_"
            tooltip="generate.new_components.vae._target_"
            required
            v-model="config.vae._target_"
          />
          <HConfigSelect
            label="pretrained_model_name_or_path"
            tooltip="generate.new_components.vae.pretrained_model_name_or_path"
            :options="pretrained_model_name_or_path_options"
            v-model="config.vae.pretrained_model_name_or_path"
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
import { merge } from 'lodash-es';
export default {
  name: 'NewComponentsConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    pretrained_model_name_or_path_options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scheduler_options,
      dpm_type_options,

      isOpenNewComponentsVaeConfig: true,

      // 备份 params.new_components
      cacheConfig: JSON.parse(JSON.stringify(default_data.new_components)),
      initNewComponentsVae: JSON.parse(JSON.stringify(default_data.new_components.vae)),

      config: JSON.parse(JSON.stringify(default_data.new_components))
    };
  },
  computed: {
    keyLength() {
      return Object.keys(this.config).length;
    },
    has_karras() {
      return (
        'scheduler' in this.config && karras_schedulers.includes(this.config.scheduler._target_)
      );
    },
    is_dpm() {
      return (
        'scheduler' in this.config &&
        (this.config.scheduler._target_ === 'diffusers.DPMSolverMultistepScheduler' ||
          this.config.scheduler._target_ === 'diffusers.DPMSolverSinglestepScheduler')
      );
    }
  },
  watch: {
    // params.new_components.vae 开关
    isOpenNewComponentsVaeConfig: {
      handler: function (val) {
        if (val) {
          this.config.vae = JSON.parse(JSON.stringify(this.initNewComponentsVae));
        } else {
          if (!this.config.vae) return;
          this.initNewComponentsVae = JSON.parse(JSON.stringify(this.config.vae));
          this.config.vae = null;
        }
      },
      immediate: true
    },
    'config.scheduler._target_': {
      handler: function (val) {
        console.log(val);
        if (
          val === 'diffusers.DPMSolverMultistepScheduler' ||
          val === 'diffusers.DPMSolverSinglestepScheduler'
        ) {
          this.$set(this.config.scheduler, 'lower_order_final', true);
        } else {
          if ('lower_order_final' in this.config.scheduler) {
            this.config.scheduler.lower_order_final = null;
            this.config.scheduler.algorithm_type = null;
          }
          if (!karras_schedulers.includes(this.config.scheduler._target_)) {
            this.config.scheduler.use_karras_sigmas = null;
          }
        }
      },
      immediate: true
    },
    config: {
      handler: function (value) {
        this.$emit('updateConfig', {
          field: 'new_components',
          value
        });
      },
      deep: true
    }
  },
  created() {
    this.config = JSON.parse(JSON.stringify(default_data.new_components));

    // 备份 params.new_components.vae
    this.initNewComponentsVae = JSON.parse(JSON.stringify(default_data.new_components.vae));
  },
  methods: {
    initConfig(info) {
      this.config = merge(this.config, JSON.parse(JSON.stringify(info.new_components)));
      const keysLength = Object.keys(this.config || {}).length;
      this.isOpenNewComponentsVaeConfig =
        keysLength > 0 && Object.keys(this.config.vae || {}).length > 0;
    },
    getConfig() {
      return this.config;
    }
  }
};
</script>
<style lang=""></style>
