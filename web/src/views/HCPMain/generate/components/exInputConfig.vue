<template>
  <h-collapse
    title="EX Input"
    showSwitch
    v-model="isOpenEXInput"
    @onSwitch="handleSwitchMergeConfig"
    showEditYaml
    :config="config.ex_input"
    @confirm="onConfirm"
  >
    <HBlock>
      <div class="config-row" v-if="config.ex_input">
        <HConfigInput
          label="cond image"
          tooltip="generate.ex_input.cond.image"
          required
          v-model="config.ex_input.cond.image"
          type="file"
        />
      </div>
    </HBlock>
  </h-collapse>
</template>
<script>
import { default_data } from '@/constants/index';
import { storeToRefs } from 'pinia';
import useConfigStore from '@/store/configStore';
import { cloneDeep, assign } from 'lodash-es';
export default {
  name: 'EXInputConfig',
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
      isOpenEXInput: false,
      // 备份 params.ex_input
      cacheConfig: cloneDeep(default_data.ex_input)
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
          this.configStore.updateGenerateByPath('ex_input', this.cacheConfig);
        } else {
          // 备份
          this.cacheConfig = cloneDeep(this.config.ex_input || default_data.ex_input);
          this.configStore.updateGenerateByPath('ex_input', null);
        }
        this.isOpenEXInput = val;
      },
      immediate: true
    }
  },
  methods: {
    onConfirm(value) {
      assign(this.config.ex_input, value);
    },
    handleSwitchMergeConfig(val) {
      this.$emit('open', val);
    }
  }
};
</script>
<style lang=""></style>
