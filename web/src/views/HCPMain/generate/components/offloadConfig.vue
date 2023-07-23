<template>
  <h-collapse
    title="Offload Config"
    showSwitch
    v-model="isOpenOffloadConfig"
    showEditYaml
    @onSwitch="handleSwitchOffloadConfig"
    :config="configStore.generate.offload"
    @confirm="onConfirm"
  >
    <HBlock>
      <template v-if="configStore.generate.offload">
        <div class="config-row">
          <el-checkbox v-model="configStore.generate.offload.vae_cpu">vae_cpu</el-checkbox>
        </div>
        <div class="config-row">
          <HConfigInput
            label="max_VRAM"
            tooltip="generate.offload.max_VRAM"
            v-model="configStore.generate.offload.max_VRAM"
          />
          <HConfigInput
            label="max_RAM"
            tooltip="generate.offload.max_RAM"
            v-model="configStore.generate.offload.max_RAM"
          />
        </div>
      </template>
    </HBlock>
  </h-collapse>
</template>
<script>
import { default_data } from '@/constants/index';
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
      cacheConfig: JSON.parse(JSON.stringify(default_data.offload))
    };
  },
  setup() {
    const configStore = useConfigStore();
    return { configStore };
  },
  watch: {
    value: {
      handler: function (val) {
        if (val) {
          // 必须修改上层才会触发响应
          this.configStore.generate = {
            ...this.configStore.generate,
            offload: cloneDeep(this.cacheConfig)
          };
        } else {
          // 备份
          this.cacheConfig = cloneDeep(this.configStore.generate.offload);
          // 必须修改上层才会触发响应
          this.configStore.generate = {
            ...this.configStore.generate,
            offload: null
          };
        }
        this.isOpenOffloadConfig = val;
      },
      immediate: true
    }
  },
  methods: {
    onConfirm(value) {
      assign(this.configStore.generate.offload, value);
    },
    handleSwitchOffloadConfig(val) {
      this.$emit('open', val);
    }
  }
};
</script>
<style lang="scss"></style>
