<template lang="">
  <h-collapse
    title="Infer_args Config"
    ref="collapseRef"
    showEditYaml
    :config="config"
    @confirm="
      (value) => {
        this.config = JSON.parse(JSON.stringify(value));
      }
    "
  >
    <HBlock>
      <div class="config-row">
        <HConfigRange
          label="width"
          tooltip="generate.infer_args.width"
          :min="128"
          :max="2048"
          :step="8"
          v-model="config.width"
        />
        <HConfigRange
          label="height"
          tooltip="generate.infer_args.height"
          :min="128"
          :max="2048"
          :step="8"
          v-model="config.height"
        />
      </div>
      <div class="config-row">
        <HConfigRange
          label="guidance_scale"
          tooltip="generate.infer_args.guidance_scale"
          :min="1"
          :max="20"
          :step="0.5"
          v-model="config.guidance_scale"
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
          v-model="config.num_inference_steps"
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
export default {
  name: 'InferArgsConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      config: JSON.parse(JSON.stringify(default_data.infer_args))
    };
  },
  computed: {
    isi2i() {
      return this.params.condition && this.params.condition.type === 'i2i';
    }
  },
  watch: {
    'params.condition.type': {
      handler: function (val) {
        if (val !== 'i2i') {
          this.config.strength = null;
        } else {
          this.config.strength = JSON.parse(JSON.stringify(default_data.infer_args.strength));
        }
      },
      deep: true,
      immediate: true
    },
    config: {
      handler: function (value) {
        this.$emit('updateConfig', {
          field: 'infer_args',
          value
        });
      },
      deep: true
    }
  },
  created() {
    this.config = JSON.parse(JSON.stringify(default_data.infer_args));
    this.initStrength();
  },
  methods: {
    initConfig(info) {
      this.config = JSON.parse(JSON.stringify(info.infer_args));
      this.initStrength(info);

      this.$nextTick(() => {
        this.$refs.collapseRef.open();
      });
    },
    getConfig() {
      return this.config;
    },
    initStrength() {
      const type = this.params.condition || {};
      if (type !== 'i2i') {
        this.config.strength = null;
      } else {
        this.config.strength = JSON.parse(JSON.stringify(default_data.infer_args.strength));
      }
    }
  }
};
</script>
<style lang=""></style>
