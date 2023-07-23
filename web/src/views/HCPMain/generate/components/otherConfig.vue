<template>
  <h-collapse
    title="Main Config"
    ref="collapseRef"
    showEditYaml
    :config="config"
    @confirm="onConfirm"
  >
    <h-block>
      <div class="config-row">
        <h-config-input
          label="out_dir"
          tooltip="generate.out_dir"
          disabled
          v-model="configStore.generate.out_dir"
        />
        <h-config-input
          tooltip="generate.emb_dir"
          label="emb_dir"
          disabled
          v-model="configStore.generate.emb_dir"
        />
      </div>
      <div class="config-row">
        <h-config-range
          label="N_repeats"
          tooltip="generate.N_repeats"
          :min="1"
          :max="5"
          v-model="configStore.generate.N_repeats"
        />
        <h-config-range
          label="clip_skip"
          tooltip="generate.clip_skip"
          :min="0"
          :max="4"
          v-model="configStore.generate.clip_skip"
        />
      </div>
      <div class="config-row">
        <h-config-range
          label="bs"
          tooltip="generate.bs"
          :min="1"
          :max="12"
          v-model="configStore.generate.bs"
        />
        <h-config-range
          label="num"
          tooltip="generate.num"
          :min="1"
          :max="100"
          v-model="configStore.generate.num"
        />
      </div>
      <div class="config-row">
        <h-config-input-number
          label="seed"
          tooltip="generate.seed"
          :min="1"
          v-model="configStore.generate.seed"
        />
        <h-config-select
          label="dtype"
          tooltip="generate.dtype"
          :options="dtype_options"
          v-model="configStore.generate.dtype"
        />
      </div>
    </h-block>
  </h-collapse>
</template>
<script>
import { dtype_options } from '@/constants/index';
import useConfigStore from '@/store/configStore';
import { pick, assign } from 'lodash-es';
const keys = ['out_dir', 'emb_dir', 'N_repeats', 'clip_skip', 'bs', 'num', 'seed', 'dtype'];
export default {
  name: 'OtherConfig',
  data() {
    return {
      dtype_options
    };
  },
  setup() {
    const configStore = useConfigStore();
    return { configStore };
  },
  computed: {
    config() {
      return pick(this.configStore.generate, keys);
    }
  },
  provide() {
    return {
      configValue: () => this.config
    };
  },
  methods: {
    initConfig() {
      if (!this.configStore.seed) {
        this.configStore.seed = 1;
      }
    },
    onConfirm(value) {
      assign(this.configStore.generate, value);
    }
  }
};
</script>
<style lang=""></style>
