<template>
  <h-collapse
    title="EX Input"
    showSwitch
    v-model="isOpenEXInput"
    @onSwitch="(e) => $emit('open', e)"
    showEditYaml
    :config="config.ex_input"
    @confirm="(value) => $set(config, 'ex_input', value)"
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
import { default_generate_data } from '@/constants/index';
import { storeToRefs } from 'pinia';
import useGenerateStore from '@/store/generateStore';
import { cloneDeep } from 'lodash-es';
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
      cacheConfig: cloneDeep(default_generate_data.ex_input)
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
          this.$set(this.config, 'ex_ipnut', this.cacheConfig);
        } else {
          // 备份
          this.cacheConfig = cloneDeep(this.config.ex_input || default_generate_data.ex_input);
          this.$set(this.config, 'ex_input', null);
        }
        this.isOpenEXInput = val;
      },
      immediate: true
    }
  }
};
</script>
<style lang=""></style>
