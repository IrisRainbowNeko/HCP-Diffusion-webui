<template>
  <h-collapse
    title="Condition Config"
    showSwitch
    v-model="isOpenConditionConfig"
    @onSwitch="(e) => $emit('open', e)"
    showEditYaml
    :config="config.condition"
    @confirm="(value) => $set(config, 'condition', value)"
  >
    <HBlock>
      <div class="config-row" v-if="config.condition">
        <HConfigSelect
          label="type"
          tooltip="generate.condition.type"
          :options="type_options"
          v-model="config.condition.type"
        />
      </div>
      <div class="config-row" v-if="config.condition">
        <HConfigInput
          label="image"
          tooltip="generate.condition.image"
          required
          v-model="config.condition.image"
          type="file"
        />
      </div>
      <div class="config-row" v-if="config.condition">
        <HConfigInput
          label="mask"
          tooltip="generate.condition.mask"
          required
          v-model="config.condition.mask"
          type="file"
        />
      </div>
    </HBlock>
  </h-collapse>
</template>
<script>
import { default_generate_data, type_options } from '@/constants/index';
import { storeToRefs } from 'pinia';
import useGenerateStore from '@/store/generateStore';
import { cloneDeep } from 'lodash-es';
export default {
  name: 'ConditionConfig',
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
      type_options,
      isOpenConditionConfig: false,
      // 备份 params.condition
      cacheConfig: cloneDeep(default_generate_data.condition)
    };
  },
  setup() {
    const generateStore = useGenerateStore();
    const { generate } = storeToRefs(generateStore);
    return { generateStore, config: generate };
  },
  watch: {
    value(val) {
      if (val) {
        this.$set(this.config, 'condition', this.cacheConfig);
      } else {
        // 备份
        this.cacheConfig = cloneDeep(this.config.condition || default_generate_data.condition);
        this.$set(this.config, 'condition', null);
      }
      this.isOpenConditionConfig = val;
    }
  }
};
</script>
<style lang=""></style>
