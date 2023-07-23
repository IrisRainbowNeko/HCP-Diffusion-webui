<template>
  <h-collapse
    title="Unet Config"
    showSwitch
    tooltip="train.unetTip"
    :showAdd="isOpen"
    v-model="isOpen"
    @onSwitch="handleUnetCollapseChange"
    @add="addUnet"
    showEditYaml
    :config="local_config"
    @confirm="(value) => (local_config = value)"
  >
    <HBlock
      :h-index="2"
      label=" "
      show-icon
      v-for="(item, unet_index) in local_config || []"
      :key="`${unet_index}-${Math.random()}`"
      @onDelete="deleteUnet(unet_index)"
    >
      <div class="config-row" style="margin-top: 10px">
        <HConfigInputNumber
          class="row-style"
          tooltip="train.unet.lr"
          :min="0"
          :max="1"
          :step="0.000001"
          label="lr"
          v-model="item.lr"
        />
        <HConfigTagSelect
          tooltip="train.unet.layers"
          label="layers"
          class="row-style"
          v-model="item.layers"
          :options="[]"
        />
      </div>
    </HBlock>
  </h-collapse>
</template>
<script>
import { default_train_data } from '@/constants/index';
export default {
  name: 'UnetConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      local_config: this.params.unet,
      isOpen: this.isOpenUnetCollapse
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
  provide() {
    return {
      configValue: () => this.local_config
    };
  },
  methods: {
    handleUnetCollapseChange(val) {
      if (val && !this.local_config) {
        this.addUnet();
      }
    },
    addUnet() {
      if (!this.local_config) {
        this.local_config = [];
      }
      this.local_config.push(JSON.parse(JSON.stringify(default_train_data.unet[0])));
    },
    deleteUnet(unet_index) {
      this.local_config.splice(unet_index, 1);
      if (this.local_config && this.local_config.length === 0) {
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
