<template>
  <h-collapse
    title="Offload Config"
    showSwitch
    v-model="isOpenOffloadConfig"
    showEditYaml
    :config="config.offload"
    @onSwitch="(e) => $emit('open', e)"
    @confirm="(value) => $set(config, 'offload', value)"
  >
    <HBlock>
      <template v-if="config.offload">
        <div class="config-row">
          <el-checkbox v-model="config.offload.vae_cpu">vae_cpu</el-checkbox>
        </div>
        <div class="config-row">
          <HConfigInput
            label="max_VRAM"
            tooltip="generate.offload.max_VRAM"
            v-model="config.offload.max_VRAM"
          />
          <HConfigInput
            label="max_RAM"
            tooltip="generate.offload.max_RAM"
            v-model="config.offload.max_RAM"
          />
        </div>
      </template>
    </HBlock>
  </h-collapse>
</template>
<script>
import { default_generate_data } from '@/constants/index';
import { storeToRefs } from 'pinia';
import useGenerateStore from '@/store/generateStore';
import { cloneDeep } from 'lodash-es';
export default {
  name: 'OffloadConfig',
  model: {
    prop: 'value',
    event: 'open'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpenOffloadConfig: false,
      // 备份 params.offload
      cacheConfig: cloneDeep(default_generate_data.offload)
    };
  },
  setup() {
    const generateStore = useGenerateStore();
    const { generate } = storeToRefs(generateStore);
    return { generateStore, config: generate };
  },
  watch: {
    value: {
      handler: function (val) {
        if (val) {
          this.$set(this.config, 'offload', this.cacheConfig);
        } else {
          // 备份
          this.cacheConfig = cloneDeep(this.config.offload || default_generate_data.offload);
          this.$set(this.config, 'offload', null);
        }
        this.isOpenOffloadConfig = val;
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss"></style>
