<template>
  <h-collapse
    title="Lora Text Encoder Config"
    showSwitch
    tooltip="train.lora_text_encoderTip"
    :showAdd="isOpen"
    v-model="isOpen"
    @onSwitch="handleLoraTextEncoderCollapseChange"
    @add="addLora_text_encoder"
    showEditYaml
    :config="local_config"
    @confirm="(value) => (local_config = value)"
  >
    <HBlock
      :h-index="2"
      label=" "
      v-for="(item, index) in local_config || []"
      :key="`${index}-${Math.random()}`"
      showIcon
      @onDelete="deleteLora_text_encoder(index)"
    >
      <div class="config-row">
        <HConfigInputNumber
          class="row-style"
          :min="0"
          :max="1"
          :step="0.000001"
          label="lr"
          tooltip="train.lora_text_encoder.lr"
          v-model="item.lr"
        />
        <HConfigInputNumber
          class="row-style"
          tooltip="train.lora_text_encoder.rank"
          label="rank"
          v-model="item.rank"
        />
      </div>
      <div class="config-row">
        <HConfigInputNumber
          class="row-style"
          :min="0"
          :max="1"
          :step="0.1"
          label="dropout"
          tooltip="train.lora_text_encoder.dropout"
          v-model="item.dropout"
        />
        <HConfigSelect
          class="row-style"
          label="branch"
          isAllowNull
          tooltip="train.lora_text_encoder.branch"
          :options="[
            { label: 'null', value: null },
            { label: 'p', value: 'p' },
            { label: 'n', value: 'n' }
          ]"
          v-model="item.branch"
        />
      </div>
      <div class="config-row">
        <HConfigTagSelect
          class="row-style"
          label="layers"
          tooltip="train.lora_text_encoder.layers"
          v-model="item.layers"
          :options="[]"
        />
      </div>
    </HBlock>
  </h-collapse>
</template>
<script>
import { default_lora_text_encoder_value } from '@/constants/index';
export default {
  name: 'TokenizerPtConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    isOpenLoraTextEncoderCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      local_config: this.params.lora_text_encoder,
      isOpen: this.isOpenLoraTextEncoderCollapse
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
    handleLoraTextEncoderCollapseChange(val) {
      if (val && !this.local_config) {
        this.addLora_text_encoder();
      }
    },
    addLora_text_encoder() {
      if (!this.local_config) {
        this.local_config = [];
      }
      this.local_config.push(JSON.parse(JSON.stringify(default_lora_text_encoder_value)));
    },
    deleteLora_text_encoder(index) {
      this.local_config.splice(index, 1);
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
