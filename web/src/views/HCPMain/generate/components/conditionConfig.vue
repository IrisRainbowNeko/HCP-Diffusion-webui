<template>
  <h-collapse
    title="Condition Config"
    showSwitch
    v-model="isOpenConditionConfig"
    @onSwitch="handleSwitchMergeConfig"
    showEditYaml
    :config="config.condition"
    @confirm="onConfirm"
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
import { default_data, type_options } from '@/constants/index';
import { storeToRefs } from 'pinia';
import useConfigStore from '@/store/configStore';
import { cloneDeep, assign } from 'lodash-es';
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
      cacheConfig: cloneDeep(default_data.condition)
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
          this.configStore.updateGenerateByPath('condition', this.cacheConfig);
        } else {
          // 备份
          this.cacheConfig = cloneDeep(this.config.condition || default_data.condition);
          this.configStore.updateGenerateByPath('condition', null);
        }
        this.isOpenConditionConfig = val;
      },
      immediate: true
    }
  },
  methods: {
    onConfirm(value) {
      assign(this.config.condition, value);
    },
    handleSwitchMergeConfig(val) {
      this.$emit('open', val);
    }
  }
};
</script>
<style lang=""></style>
