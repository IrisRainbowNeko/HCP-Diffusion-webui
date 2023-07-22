<template>
  <h-collapse
    title="Plugin TE Config"
    showSwitch
    :showAdd="isOpen"
    v-model="isOpen"
    tooltip="train.plugin_TETip"
    @onSwitch="handlePluginTeCollapseChange"
    @add="addPluginTe"
    showEditYaml
    :config="local_config"
    @confirm="(value) => (local_config = value)"
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
        <el-checkbox v-model="local_config[plugin]._partial_">_partial_</el-checkbox>
      </div>
      <div class="config-row">
        <HConfigInput
          class="row-style"
          disabled
          label="_target_"
          tooltip="train.plugin_TE.controlnet._target_"
          v-model="local_config[plugin]._target_"
        />
        <HConfigInputNumber
          class="row-style"
          label="lr"
          tooltip="train.plugin_TE.controlnet.lr"
          v-model="local_config[plugin].lr"
        />
      </div>
      <div class="config-row">
        <HConfigTagSelect
          label="from_layers"
          class="row-style"
          tooltip="train.plugin_TE.controlnet.from_layers"
          v-model="local_config[plugin].from_layers"
          :options="['pre_hook:', 'pre_hook:conv_in']"
        />
      </div>
      <div class="config-row">
        <HConfigTagSelect
          label="to_layers"
          class="row-style"
          tooltip="train.plugin_TE.controlnet.to_layers"
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
    isOpenPluginTeCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      local_config: this.params.plugin_TE,
      isOpen: this.isOpenPluginTeCollapse
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
    pluginTeList() {
      const data = this.local_config;
      const keys = Object.keys(data || {});
      return keys;
    },
    pluginTeName({ pluginTeList }) {
      const length = pluginTeList.length;
      return `controlnet${length + 1}`;
    }
  },
  provide() {
    return {
      configValue: () => this.local_config
    };
  },
  methods: {
    handlePluginTeCollapseChange(val) {
      if (val && !this.local_config) {
        this.addPluginTe();
      }
    },
    addPluginTe() {
      if (!this.local_config) {
        this.local_config = {};
      }
      this.$set(
        this.local_config,
        this.pluginTeName,
        JSON.parse(JSON.stringify(default_train_data.plugin_TE.controlnet1))
      );
    },
    deletePluginTe(pluginTeName) {
      this.$delete(this.local_config, pluginTeName);
      if (Object.keys(this.local_config).length === 0) {
        this.local_config = null;
        this.isOpen = false;
      }
    },
    editPluginTeKey({ oldKeyName, newKeyName }) {
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
