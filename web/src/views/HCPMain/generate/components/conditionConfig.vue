<template>
  <h-collapse
    title="Condition Config"
    showSwitch
    v-model="isOpenConditionConfig"
    @onSwitch="handleSwitchMergeConfig"
    showEditYaml
    :config="config"
    @confirm="onConfirm"
  >
    <HBlock>
      <div class="config-row" v-if="configStore.generate.condition">
        <HConfigSelect
          label="type"
          tooltip="generate.condition.type"
          :options="type_options"
          v-model="configStore.generate.condition.type"
        />
      </div>
      <div class="config-row" v-if="config">
        <HConfigInput
          label="image"
          tooltip="generate.condition.image"
          required
          v-model="configStore.generate.condition.image"
          type="file"
        />
      </div>
      <div class="config-row" v-if="config">
        <HConfigInput
          label="mask"
          tooltip="generate.condition.mask"
          required
          v-model="configStore.generate.condition.mask"
          type="file"
        />
      </div>
    </HBlock>
  </h-collapse>
</template>
<script>
import { default_data, type_options } from '@/constants/index';
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
    return { configStore };
  },
  computed: {
    config() {
      return this.configStore.generate.condition;
    }
  },
  watch: {
    value: {
      handler: function (val) {
        if (val) {
          // 必须修改上层才会触发响应
          this.configStore.generate = {
            ...this.configStore.generate,
            conditon: cloneDeep(this.cacheConfig)
          };
        } else {
          // 备份
          this.cacheConfig = cloneDeep(this.configStore.generate.condition);
          // 必须修改上层才会触发响应
          this.configStore.generate = {
            ...this.configStore.generate,
            conditon: null
          };
        }
        this.isOpenConditionConfig = val;
      },
      immediate: true
    }
  },
  methods: {
    onConfirm(value) {
      assign(this.configStore.generate.condition, value);
    },
    handleSwitchMergeConfig(val) {
      this.$emit('open', val);
    }
  }
};
</script>
<style lang=""></style>
