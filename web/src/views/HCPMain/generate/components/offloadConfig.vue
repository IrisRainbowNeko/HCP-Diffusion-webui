<template>
  <h-collapse
    title="Offload Config"
    showSwitch
    v-model="isOpenOffloadConfig"
    showEditYaml
    @onSwitch="handleSwitchOffloadConfig"
    :config="config.offload"
    @confirm="onConfirm"
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
import { default_data } from '@/constants/index';
import { storeToRefs } from 'pinia';
import useConfigStore from '@/store/configStore';
import { assign, cloneDeep } from 'lodash-es';
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
      cacheConfig: cloneDeep(default_data.offload)
    };
  },
  setup() {
    const configStore = useConfigStore();
    const { generate } = storeToRefs(configStore);
    return { configStore, config: generate };
  },
  watch: {
    value: {
      handler: function (val) {
        if (val) {
          this.configStore.updateGenerateByPath('offload', this.cacheConfig);
        } else {
          // 备份
          this.cacheConfig = cloneDeep(this.config.offload || default_data.offload);
          this.configStore.updateGenerateByPath('offload', null);
        }
        this.isOpenOffloadConfig = val;
      },
      immediate: true
    }
  },
  methods: {
    onConfirm(value) {
      assign(this.config.offload, value);
    },
    handleSwitchOffloadConfig(val) {
      this.$emit('open', val);
    }
  }
};
</script>
<style lang="scss"></style>
