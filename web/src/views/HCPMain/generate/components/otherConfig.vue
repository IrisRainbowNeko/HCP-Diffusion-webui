<template>
  <h-collapse
    title="Main Config"
    ref="collapseRef"
    showEditYaml
    :config="config"
    @confirm="
      (value) => {
        config = JSON.parse(JSON.stringify(value));
      }
    "
  >
    <h-block>
      <div class="config-row">
        <h-config-input
          label="out_dir"
          tooltip="generate.out_dir"
          disabled
          v-model="config.out_dir"
        />
        <h-config-input
          tooltip="generate.emb_dir"
          label="emb_dir"
          disabled
          v-model="config.emb_dir"
        />
      </div>
      <div class="config-row">
        <h-config-range
          label="N_repeats"
          tooltip="generate.N_repeats"
          :min="1"
          :max="5"
          v-model="config.N_repeats"
        />
        <h-config-range
          label="clip_skip"
          tooltip="generate.clip_skip"
          :min="0"
          :max="4"
          v-model="config.clip_skip"
        />
      </div>
      <div class="config-row">
        <h-config-range label="bs" tooltip="generate.bs" :min="1" :max="12" v-model="config.bs" />
        <h-config-range
          label="num"
          tooltip="generate.num"
          :min="1"
          :max="100"
          v-model="config.num"
        />
      </div>
      <div class="config-row">
        <h-config-input-number
          label="seed"
          tooltip="generate.seed"
          :min="1"
          v-model="config.seed"
        />
        <h-config-select
          label="dtype"
          tooltip="generate.dtype"
          :options="dtype_options"
          v-model="config.dtype"
        />
      </div>
    </h-block>
  </h-collapse>
</template>
<script>
import { dtype_options } from '@/constants/index';
export default {
  name: 'OtherConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dtype_options,

      config: JSON.parse(
        JSON.stringify(this.params, [
          'out_dir',
          'emb_dir',
          'N_repeats',
          'clip_skip',
          'bs',
          'num',
          'seed',
          'dtype'
        ])
      )
    };
  },
  watch: {
    config: {
      handler: function (value) {
        this.$emit('updateConfig', {
          field: 'other',
          value: JSON.parse(JSON.stringify(value))
        });
      },
      deep: true
    }
  },
  mounted() {
    this.initConfig();
  },
  methods: {
    initConfig() {
      Object.keys(this.config).forEach((key) => {
        if (key === 'seed' && !this.params[key]) {
          this.config[key] = 1;
          return;
        }
        this.config[key] = this.params[key];
      });
      this.$nextTick(() => {
        this.$refs.collapseRef.open();
      });
    }
  }
};
</script>
<style lang=""></style>
