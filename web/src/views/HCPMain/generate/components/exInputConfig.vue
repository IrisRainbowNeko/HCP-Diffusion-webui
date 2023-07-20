<template>
  <h-collapse
    title="EX Input"
    showSwitch
    v-model="isOpenEXInput"
    @onSwitch="handleSwitchMergeConfig"
    showEditYaml
    :config="config"
    @confirm="
      (value) => {
        this.config = JSON.parse(JSON.stringify(value));
      }
    "
  >
    <HBlock>
      <div class="config-row" v-if="config">
        <HConfigInput
          label="cond image"
          tooltip="generate.ex_input.cond.image"
          required
          v-model="config.cond.image"
          type="file"
        />
      </div>
    </HBlock>
  </h-collapse>
</template>
<script>
import { default_data } from '@/constants/index';
export default {
  name: 'EXInputConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isOpenEXInput: false,

      // 备份 params.ex_input
      cacheConfig: JSON.parse(JSON.stringify(default_data.ex_input)),

      config: null
    };
  },
  watch: {
    isOpenEXInput: {
      handler: function (val) {
        if (val) {
          this.config = JSON.parse(JSON.stringify(this.cacheConfig));
          if (!this.params.ex_input && !this.config) {
            this.config = JSON.parse(JSON.stringify(default_data.ex_input));
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
          field: 'ex_input',
          value: JSON.parse(JSON.stringify(value))
        });
      },
      deep: true
    }
  },
  created() {
    this.cacheConfig = JSON.parse(JSON.stringify(default_data.ex_input));
  },
  methods: {
    initConfig(info) {
      const ex_input = JSON.parse(JSON.stringify(info.ex_input));
      this.$set(this, 'config', ex_input);
      this.isOpenEXInput = !!this.config;
      // 为了解决切换状态时，config 会被重置的问题
      setTimeout(() => {
        if (this.isOpenEXInput && (!!this.config || !this.config)) {
          this.config = JSON.parse(JSON.stringify(info.ex_input || default_data.ex_input));
        }
      }, 300);
    },
    getConfig() {
      return this.config;
    },
    handleSwitchMergeConfig(val) {
      this.$emit('onOpen', val);
    }
  }
};
</script>
<style lang=""></style>
