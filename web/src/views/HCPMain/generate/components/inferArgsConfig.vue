<template lang="">
  <h-collapse
    title="Infer_args Config"
    ref="collapseRef"
    showEditYaml
    :config="config.infer_args"
    @confirm="(value) => $set(config, 'infer_args', value)"
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
          v-model="config.infer_args.strength"
        />
      </div>
    </HBlock>
  </h-collapse>
</template>
<script>
import { default_generate_data } from '@/constants/index';
import { storeToRefs } from 'pinia';
import useGenerateStore from '@/store/generateStore';
export default {
  name: 'InferArgsConfig',
  setup() {
    const generateStore = useGenerateStore();
    const { generate } = storeToRefs(generateStore);
    return { generateStore, config: generate };
  },
  computed: {
    isi2i() {
      return this.config.condition && this.config.condition.type === 'i2i';
    }
  },
  watch: {
    'config.condition.type': {
      handler: function () {
        this.handleStrength(this.config);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    initDefaultData(newInfo) {
      this.handleStrength(newInfo);
    },
    handleStrength(info) {
      const infer_args = info.infer_args;
      if (info.condition && info.condition.type === 'i2i') {
        if (!infer_args.strength)
          this.$set(infer_args, 'strength', default_generate_data.infer_args.strength);
      } else {
        if (infer_args.strength) this.$delete(infer_args, 'strength');
      }
    }
  }
};
</script>
<style lang=""></style>
