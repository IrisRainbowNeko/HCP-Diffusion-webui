<template>
  <h-collapse
    title="Plugin Unet Config"
    showSwitch
    tooltip="train.plugin_unetTip"
    :showAdd="isOpen"
    v-model="isOpen"
    showEditYaml
    :config="config.plugin_unet"
    @onSwitch="(e) => $emit('open', e)"
    @add="addPluginUnet"
    @confirm="(value) => (config.plugin_unet = value)"
  >
    <HBlock
      :h-index="2"
      :label="plugin"
      v-for="plugin in pluginUnetList"
      :key="plugin"
      :show-icon="true"
      showEditKey
      tooltip="train.plugin_unet.controlnetTip"
      @onEditKey="editPluginUnetKey"
      @onDelete="deletePluginUnet(plugin)"
    >
      <div class="config-row">
        <el-checkbox v-model="config.plugin_unet[plugin]._partial_">_partial_</el-checkbox>
      </div>
      <div class="config-row">
        <HConfigInput
          class="row-style"
          disabled
          label="_target_"
          tooltip="train.plugin_unet.controlnet._target_"
          v-model="config.plugin_unet[plugin]._target_"
        />
        <HConfigInputNumber
          class="row-style"
          label="lr"
          tooltip="train.plugin_unet.controlnet.lr"
          v-model="config.plugin_unet[plugin].lr"
        />
      </div>
      <div class="config-row">
        <HConfigTagSelect
          class="row-style"
          label="from_layers"
          v-model="config.plugin_unet[plugin].from_layers"
          tooltip="train.plugin_unet.controlnet.from_layers"
          :options="['pre_hook:', 'pre_hook:conv_in']"
        />
      </div>
      <div class="config-row">
        <HConfigTagSelect
          class="row-style"
          label="to_layers"
          tooltip="train.plugin_unet.controlnet.to_layers"
          v-model="config.plugin_unet[plugin].to_layers"
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
      cacheConfig: cloneDeep(default_train_data.plugin_unet)
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
        this.$set(this.config, 'plugin_unet', this.cacheConfig);
        if (!this.config.plugin_unet || this.config.plugin_unet.length == 0) {
          this.addPluginUnet();
        }
      } else {
        // 备份
        this.cacheConfig = cloneDeep(this.config.plugin_unet || default_train_data.plugin_unet);
        this.$set(this.config, 'plugin_unet', null);
      }
      this.isOpen = val;
    }
  },
  computed: {
    pluginUnetList() {
      const data = this.config.plugin_unet;
      const keys = Object.keys(data || {});
      return keys;
    },
    pluginUnetName({ pluginUnetList }) {
      const controlnetKeys = filter(pluginUnetList, (key) => controlnetRegExp.test(key));
      const nums = map(controlnetKeys, (key) => Number(key.replace(controlnet_key, '')));
      const num = nums.length === 0 ? 1 : max(nums) + 1;
      return `${controlnet_key}${num}`;
    }
  },
  methods: {
    addPluginUnet() {
      if (!this.config.plugin_unet) {
        this.config.plugin_unet = {};
      }
      this.$set(
        this.config.plugin_unet,
        this.pluginUnetName,
        cloneDeep(default_train_data.plugin_unet.controlnet1)
      );
    },
    deletePluginUnet(pluginUnetName) {
      this.$delete(this.config.plugin_unet, pluginUnetName);
      if (Object.keys(this.config.plugin_unet).length === 0) {
        this.config.plugin_unet = null;
        this.isOpen = false;
      }
    },
    editPluginUnetKey({ oldKeyName, newKeyName }) {
      const oldData = cloneDeep(this.config.plugin_unet[oldKeyName]);
      this.$delete(this.config.plugin_unet, oldKeyName);
      this.$set(this.config.plugin_unet, newKeyName, oldData);
    }
  }
};
</script>
<style lang=""></style>
