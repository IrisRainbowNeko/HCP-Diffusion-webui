<template>
  <h-collapse
    title="Offload Config"
    showSwitch
    v-model="isOpenOffloadConfig"
    showEditYaml
    :config="config"
    @confirm="
      (value) => {
        config = JSON.parse(JSON.stringify(value));
      }
    "
  >
    <HBlock>
      <template v-if="config">
        <div class="config-row">
          <el-checkbox v-model="config.vae_cpu">vae_cpu</el-checkbox>
        </div>
        <div class="config-row">
          <HConfigInput
            label="max_VRAM"
            tooltip="generate.offload.max_VRAM"
            v-model="config.max_VRAM"
          />
          <HConfigInput
            label="max_RAM"
            tooltip="generate.offload.max_RAM"
            v-model="config.max_RAM"
          />
        </div>
      </template>
    </HBlock>
  </h-collapse>
</template>
<script>
import { default_data } from '@/constants/index';
export default {
  name: 'OffloadConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isOpenOffloadConfig: false,

      // 备份 params.offload
      cacheConfig: JSON.parse(JSON.stringify(default_data.offload)),

      config: null
    };
  },
  watch: {
    isOpenOffloadConfig: {
      handler: function (val) {
        if (val) {
          this.config = JSON.parse(JSON.stringify(this.cacheConfig));
          if (!this.config && !this.params.config) {
            this.config = JSON.parse(JSON.stringify(default_data.offload));
          }
        } else {
          // 备份
          this.cacheConfig = JSON.parse(JSON.stringify(this.config));
          this.config = null;
        }
      },
      immediate: true
    },
    config: {
      handler: function (value) {
        this.$emit('updateConfig', {
          field: 'offload',
          value
        });
      },
      deep: true
    }
  },
  provide() {
    return {
      configValue: () => this.config
    };
  },
  created() {
    this.cacheConfig = JSON.parse(JSON.stringify(default_data.offload));
  },
  methods: {
    initConfig(info) {
      this.config = JSON.parse(JSON.stringify(info.offload));

      this.isOpenOffloadConfig = !!this.config;
    },
    getConfig() {
      return this.config;
    }
  }
};
</script>
<style lang="scss"></style>
