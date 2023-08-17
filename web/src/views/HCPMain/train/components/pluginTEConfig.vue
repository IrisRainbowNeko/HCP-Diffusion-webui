<template>
  <h-collapse
    title="Plugin TE Config"
    showSwitch
    :showAdd="isOpen"
    v-model="isOpen"
    tooltip="train.plugin_TETip"
    showEditYaml
    :config="config.plugin_TE"
    @onSwitch="(e) => $emit('open', e)"
    @add="addPluginTe"
    @confirm="(value) => (config.plugin_TE = value)"
  >
    <HBlock
      :h-index="2"
      :label="plugin"
      v-for="plugin in pluginTeList"
      :key="plugin"
      :show-icon="true"
      showEditKey
      tooltip="train.plugin_TE.controlnetTip"
      @onEditKey="editPluginTeKey"
      @onDelete="deletePluginTe(plugin)"
    >
      <div class="config-row">
        <el-checkbox v-model="config.plugin_TE[plugin]._partial_">_partial_</el-checkbox>
      </div>
      <div class="config-row">
        <HConfigInput
          class="row-style"
          disabled
          label="_target_"
          tooltip="train.plugin_TE.controlnet._target_"
          v-model="config.plugin_TE[plugin]._target_"
        />
        <HConfigInputNumber
          class="row-style"
          label="lr"
          tooltip="train.plugin_TE.controlnet.lr"
          v-model="config.plugin_TE[plugin].lr"
        />
      </div>
      <div class="config-row">
        <HConfigTagSelect
          label="from_layers"
          class="row-style"
          tooltip="train.plugin_TE.controlnet.from_layers"
          v-model="config.plugin_TE[plugin].from_layers"
          :options="['pre_hook:', 'pre_hook:conv_in']"
        />
      </div>
      <div class="config-row">
        <HConfigTagSelect
          label="to_layers"
          class="row-style"
          tooltip="train.plugin_TE.controlnet.to_layers"
          v-model="config.plugin_TE[plugin].to_layers"
          :options="[
            'down_blocks.0',
            'down_blocks.1',
            'down_blocks.2',
            'down_blocks.3',
            'mid_block',
            'pre_hook:up_blocks.3.resnets.2'
          ]"
        />
      </div>
    </HBlock>
  </h-collapse>
</template>
<script>
import { storeToRefs } from 'pinia';
import { cloneDeep, filter, map, max } from 'lodash-es';
import useTrainStore from '@/store/trainStore';
import { default_train_data } from '@/constants/index';
const controlnet_key = 'controlnet';
const controlnetRegExp = new RegExp(`${controlnet_key}\\d+`);
export default {
  name: 'TokenizerPtConfig',
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
      isOpen: false,
      cacheConfig: cloneDeep(default_train_data.plugin_TE)
    };
  },
  setup() {
    const trainStore = useTrainStore();
    const { train } = storeToRefs(trainStore);
    return { trainStore, config: train };
  },
  watch: {
    value(val) {
      if (val) {
        this.$set(this.config, 'plugin_TE', this.cacheConfig);
        if (!this.config.plugin_TE || this.config.plugin_TE.length == 0) {
          this.addPluginTe();
        }
      } else {
        // 备份
        this.cacheConfig = cloneDeep(this.config.plugin_TE || default_train_data.plugin_TE);
        this.$set(this.config, 'plugin_TE', null);
      }
      this.isOpen = val;
    }
  },
  computed: {
    pluginTeList() {
      const data = this.config.plugin_TE;
      const keys = Object.keys(data || {});
      return keys;
    },
    pluginTeName({ pluginTeList }) {
      const controlnetKeys = filter(pluginTeList, (key) => controlnetRegExp.test(key));
      const nums = map(controlnetKeys, (key) => Number(key.replace(controlnet_key, '')));
      const num = nums.length === 0 ? 1 : max(nums) + 1;
      return `${controlnet_key}${num}`;
    }
  },
  methods: {
    addPluginTe() {
      if (!this.config.plugin_TE) {
        this.config.plugin_TE = {};
      }
      this.$set(
        this.config.plugin_TE,
        this.pluginTeName,
        cloneDeep(default_train_data.plugin_TE.controlnet1)
      );
    },
    deletePluginTe(pluginTeName) {
      this.$delete(this.config.plugin_TE, pluginTeName);
      if (Object.keys(this.config.plugin_TE).length === 0) {
        this.config.plugin_TE = null;
        this.isOpen = false;
      }
    },
    editPluginTeKey({ oldKeyName, newKeyName }) {
      const oldData = cloneDeep(this.config.plugin_TE[oldKeyName]);
      this.$delete(this.config.plugin_TE, oldKeyName);
      this.$set(this.config.plugin_TE, newKeyName, oldData);
    }
  }
};
</script>
<style lang=""></style>
