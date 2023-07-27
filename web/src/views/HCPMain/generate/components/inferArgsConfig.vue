<template lang="">
  <h-collapse
    title="Infer_args Config"
    ref="collapseRef"
    showEditYaml
    :config="config.infer_args"
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
          v-model="config.infer_args.width"
        />
        <HConfigRange
          label="height"
          tooltip="generate.infer_args.height"
          :min="128"
          :max="2048"
          :step="8"
          v-model="config.infer_args.height"
        />
      </div>
      <div class="config-row">
        <HConfigRange
          label="guidance_scale"
          tooltip="generate.infer_args.guidance_scale"
          :min="1"
          :max="20"
          :step="0.5"
          v-model="config.infer_args.guidance_scale"
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
          v-model="config.infer_args.num_inference_steps"
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
import { storeToRefs } from 'pinia';
import useConfigStore from '@/store/configStore';
import { cloneDeep, assign } from 'lodash-es';
export default {
  name: 'InferArgsConfig',
  setup() {
    const configStore = useConfigStore();
    const { generate } = storeToRefs(configStore);
    return { configStore, config: generate };
  },
  computed: {
    isi2i() {
      return this.config.condition && this.config.condition.type === 'i2i';
    }
  },
  watch: {
    'config.condition.type': {
      handler: function (val) {
        if (val !== 'i2i') {
          this.config.infer_args.strength = null;
        } else {
          this.config.infer_args.strength = cloneDeep(default_data.infer_args.strength);
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onConfirm(value) {
      assign(this.config.infer_args, value);
    }
  }
};
</script>
<style lang=""></style>
