<template lang="">
  <h-collapse
    title="Infer_args Config"
    ref="collapseRef"
    showEditYaml
    :config="config"
    @confirm="onConfirm"
  >
    <HBlock>
      <div class="config-row">
        <HConfigRange
          label="width"
          tooltip="generate.infer_args.width"
          :min="128"
          :max="2048"
          :step="8"
          v-model="configStore.generate.infer_args.width"
        />
        <HConfigRange
          label="height"
          tooltip="generate.infer_args.height"
          :min="128"
          :max="2048"
          :step="8"
          v-model="configStore.generate.infer_args.height"
        />
      </div>
      <div class="config-row">
        <HConfigRange
          label="guidance_scale"
          tooltip="generate.infer_args.guidance_scale"
          :min="1"
          :max="20"
          :step="0.5"
          v-model="configStore.generate.infer_args.guidance_scale"
        />
      </div>
      <div class="config-row">
        <HConfigRange
          label="num_inference_steps"
          tooltip="generate.infer_args.num_inference_steps"
          :min="1"
          :max="200"
          :step="1"
          integer
          v-model="configStore.generate.infer_args.num_inference_steps"
        />
      </div>
      <div class="config-row" v-if="isi2i">
        <HConfigRange
          label="strength"
          tooltip="generate.infer_args.strength"
          :min="0"
          :max="1"
          :step="0.01"
          v-model="config.strength"
        />
      </div>
    </HBlock>
  </h-collapse>
</template>
<script>
import { default_data } from '@/constants/index';
import useConfigStore from '@/store/configStore';
import { cloneDeep, assign } from 'lodash-es';
export default {
  name: 'InferArgsConfig',
  setup() {
    const configStore = useConfigStore();
    return { configStore };
  },
  computed: {
    isi2i() {
      return (
        this.configStore.generate.condition && this.configStore.generate.condition.type === 'i2i'
      );
    },
    config() {
      return cloneDeep(this.configStore.generate.infer_args);
    }
  },
  watch: {
    'configStore.generate.condition.type': {
      handler: function (val) {
        if (val !== 'i2i') {
          this.configStore.generate.infer_args.strength = null;
        } else {
          this.configStore.generate.infer_args.strength = cloneDeep(
            default_data.infer_args.strength
          );
        }
      },
      deep: true,
      immediate: true
    }
  },
  provide() {
    return {
      configValue: () => this.configStore.generate.infer_args
    };
  },
  methods: {
    onConfirm(value) {
      assign(this.configStore.generate.infer_args, value);
    }
  }
};
</script>
<style lang=""></style>
