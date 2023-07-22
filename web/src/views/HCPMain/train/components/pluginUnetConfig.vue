<template>
  <h-collapse
    title="Plugin Unet Config"
    showSwitch
    tooltip="train.plugin_unetTip"
    :showAdd="isOpen"
    v-model="isOpen"
    @onSwitch="handlePluginUnetCollapseChange"
    @add="addPluginUnet"
    showEditYaml
    :config="local_config"
    @confirm="(value) => this.$set(this.params, 'plugin_unet', value)"
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
        <el-checkbox v-model="local_config[plugin]._partial_">_partial_</el-checkbox>
      </div>
      <div class="config-row">
        <HConfigInput
          class="row-style"
          disabled
          label="_target_"
          tooltip="train.plugin_unet.controlnet._target_"
          v-model="local_config[plugin]._target_"
        />
        <HConfigInputNumber
          class="row-style"
          label="lr"
          tooltip="train.plugin_unet.controlnet.lr"
          v-model="local_config[plugin].lr"
        />
      </div>
      <div class="config-row">
        <HConfigTagSelect
          class="row-style"
          label="from_layers"
          v-model="local_config[plugin].from_layers"
          tooltip="train.plugin_unet.controlnet.from_layers"
          :options="['pre_hook:', 'pre_hook:conv_in']"
        />
      </div>
      <div class="config-row">
        <HConfigTagSelect
          class="row-style"
          label="to_layers"
          tooltip="train.plugin_unet.controlnet.to_layers"
          v-model="local_config[plugin].to_layers"
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
import { default_train_data } from '@/constants/index';
export default {
  name: 'TokenizerPtConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    isOpenPluginUnetCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      local_config: this.params.plugin_unet,
      isOpen: this.isOpenPluginUnetCollapse
    };
  },
  watch: {
    isOpen(val) {
      this.$emit('onSwitch', val);
    },
    local_config: {
      handler(val) {
        this.$emit('updateData', val);
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    pluginUnetList() {
      const data = this.local_config;
      const keys = Object.keys(data || {});
      return keys;
    },
    pluginUnetName({ pluginUnetList }) {
      const length = pluginUnetList.length;
      return `controlnet${length + 1}`;
    }
  },
  provide() {
    return {
      configValue: () => this.local_config
    };
  },
  methods: {
    handlePluginUnetCollapseChange(val) {
      if (val && !this.local_config) {
        this.addPluginUnet();
      }
    },
    addPluginUnet() {
      if (!this.local_config) {
        this.$set(this.params, 'plugin_unet', {});
      }
      this.$set(
        this.local_config,
        this.pluginUnetName,
        JSON.parse(JSON.stringify(default_train_data.plugin_unet.controlnet1))
      );
    },
    deletePluginUnet(pluginUnetName) {
      this.$delete(this.local_config, pluginUnetName);
      if (Object.keys(this.local_config).length === 0) {
        this.$set(this.params, 'plugin_unet', null);
        this.isOpen = false;
      }
    },
    editPluginUnetKey({ oldKeyName, newKeyName }) {
      const oldData = JSON.parse(JSON.stringify(this.local_config[oldKeyName]));
      this.$delete(this.local_config, oldKeyName);
      this.$set(this.local_config, newKeyName, oldData);
    },
    updateData() {
      this.$emit('updateData', this.local_config);
    }
  }
};
</script>
<style lang=""></style>
