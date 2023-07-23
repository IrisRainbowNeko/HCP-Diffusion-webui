<template>
  <h-collapse
    title="EX Input"
    showSwitch
    v-model="isOpenEXInput"
    @onSwitch="handleSwitchMergeConfig"
    showEditYaml
    :config="configStore.generate.ex_input"
    @confirm="onConfirm"
  >
    <HBlock>
      <div class="config-row" v-if="configStore.generate.ex_input">
        <HConfigInput
          label="cond image"
          tooltip="generate.ex_input.cond.image"
          required
          v-model="configStore.generate.ex_input.cond.image"
          type="file"
        />
      </div>
    </HBlock>
  </h-collapse>
</template>
<script>
import { default_data } from '@/constants/index';
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
    return { configStore };
  },
  watch: {
    value: {
      handler: function (val) {
        if (val) {
          // 必须修改上层才会触发响应
          this.configStore.generate = {
            ...this.configStore.generate,
            ex_input: cloneDeep(this.cacheConfig)
          };
        } else {
          // 备份
          this.cacheConfig = cloneDeep(this.configStore.generate.ex_input);
          // 必须修改上层才会触发响应
          this.configStore.generate = {
            ...this.configStore.generate,
            ex_input: null
          };
        }
        this.isOpenEXInput = val;
      },
      immediate: true
    }
  },
  methods: {
    onConfirm(value) {
      assign(this.configStore.generate.ex_input, value);
    },
    handleSwitchMergeConfig(val) {
      this.$emit('open', val);
    }
  }
};
</script>
<style lang=""></style>
