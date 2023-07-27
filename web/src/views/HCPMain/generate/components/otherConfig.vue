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
          v-model="generate.out_dir"
        />
        <h-config-input
          tooltip="generate.emb_dir"
          label="emb_dir"
          disabled
          v-model="generate.emb_dir"
        />
      </div>
      <div class="config-row">
        <h-config-range
          label="N_repeats"
          tooltip="generate.N_repeats"
          :min="1"
          :max="5"
          v-model="generate.N_repeats"
        />
        <h-config-range
          label="clip_skip"
          tooltip="generate.clip_skip"
          :min="0"
          :max="4"
          v-model="generate.clip_skip"
        />
      </div>
      <div class="config-row">
        <h-config-range label="bs" tooltip="generate.bs" :min="1" :max="12" v-model="generate.bs" />
        <h-config-range
          label="num"
          tooltip="generate.num"
          :min="1"
          :max="100"
          v-model="generate.num"
        />
      </div>
      <div class="config-row">
        <h-config-input-number
          label="seed"
          tooltip="generate.seed"
          :min="1"
          v-model="generate.seed"
        />
        <h-config-select
          label="dtype"
          tooltip="generate.dtype"
          :options="dtype_options"
          v-model="generate.dtype"
        />
      </div>
    </h-block>
  </h-collapse>
</template>
<script>
import { dtype_options } from '@/constants/index';
import { storeToRefs } from 'pinia';
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
    const { generate } = storeToRefs(configStore);
    return { configStore, generate };
  },
  computed: {
    config() {
      return pick(this.generate, keys);
    }
  },
  mounted() {
    if (!this.generate.seed) {
      this.generate.seed = 1;
    }
  },
  methods: {
    onConfirm(value) {
      assign(this.generate, value);
    }
  }
};
</script>
<style lang=""></style>
