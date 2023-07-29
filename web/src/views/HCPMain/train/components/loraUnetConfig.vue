<template>
  <h-collapse
    title="Lora Unet Config"
    showSwitch
    tooltip="train.lora_unetTip"
    :showAdd="isOpen"
    v-model="isOpen"
    @onSwitch="handleLoraUnetCollapseChange"
    @add="addLora_unet"
    showEditYaml
    :config="local_config"
    @confirm="(value) => (local_config = value)"
  >
    <div class="block-style-item" v-for="(item, index) in local_config || []" :key="index">
      <HBlock label=" " :h-index="2" show-icon @onDelete="deleteLora_unet(index)">
        <div class="config-row">
          <HConfigInputNumber
            class="row-style"
            label="lr"
            :min="0"
            :max="1"
            tooltip="train.lora_unet.lr"
            :step="0.0001"
            v-model="item.lr"
          />
          <div class="config-row" style="flex: 1">
            <el-checkbox v-model="item.bias">bias</el-checkbox>
          </div>
        </div>
        <div class="config-row">
          <HConfigTagSelect
            class="row-style"
            label="layers"
            v-model="item.layers"
            tooltip="train.lora_unet.layers"
            :options="[
              're:.*\\.resnets$',
              're:.*\\.proj_in$',
              're:.*\\.proj_out$',
              're:.*\\.conv$',
              're:.*\\.attn.?$',
              're:.*\\.ff$'
            ]"
          />
          <HConfigInputNumber
            class="row-style"
            label="rank"
            tooltip="train.lora_unet.rank"
            v-model="item.rank"
          />
        </div>
        <div class="config-row">
          <HConfigSelect
            class="row-style"
            label="branch"
            clearable
            isAllowNull
            tooltip="train.lora_unet.branch"
            :options="[
              { label: 'null', value: null },
              { label: 'p', value: 'p' },
              { label: 'n', value: 'n' }
            ]"
            v-model="item.branch"
          />
          <HConfigInputNumber
            class="row-style"
            tooltip="train.lora_unet.dropout"
            label="dropout"
            v-model="item.dropout"
          />
        </div>
      </HBlock>
    </div>
  </h-collapse>
</template>
<script>
import { lora_unet_default_value } from '@/constants/index';
export default {
  name: 'LoraUnetConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    isOpenLoraUnetCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      local_config: this.params.lora_unet,
      isOpen: this.isOpenLoraUnetCollapse
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
  methods: {
    handleLoraUnetCollapseChange(val) {
      if (val && !this.local_config) {
        this.addLora_unet();
      }
    },
    addLora_unet() {
      if (!this.local_config) {
        this.local_config = [];
      }
      this.local_config.push(JSON.parse(JSON.stringify(lora_unet_default_value)));
      this.$forceUpdate();
    },
    deleteLora_unet(index) {
      this.local_config.splice(index, 1);
      if (this.local_config.length === 0) {
        this.local_config = null;
        this.isOpen = false;
      }
    },
    updateData() {
      this.$emit('updateData', this.local_config);
    }
  }
};
</script>
<style lang=""></style>
