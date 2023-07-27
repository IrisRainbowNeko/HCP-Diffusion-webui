<template>
  <h-collapse
    title="Text Encoder Config"
    showSwitch
    tooltip="train.text_encoderTip"
    :showAdd="isOpen"
    v-model="isOpen"
    @onSwitch="handleTextEncoderCollapseChange"
    @add="addTextEncoder"
    showEditYaml
    :config="local_config"
    @confirm="(value) => (local_config = value)"
  >
    <div
      class="block-style-item"
      v-for="(item, unet_index) in local_config || []"
      :key="`${unet_index}-${Math.random()}`"
    >
      <HBlock :h-index="2" label=" " show-icon @onDelete="deleteTextEncoder(unet_index)">
        <div class="config-row">
          <HConfigInputNumber
            class="row-style"
            tooltip="train.text_encoder.lr"
            :min="0"
            :max="1"
            :step="0.000001"
            label="lr"
            v-model="item.lr"
          />
          <HConfigTagSelect
            class="row-style"
            label="layers"
            tooltip="train.text_encoder.layers"
            v-model="item.layers"
            :options="[]"
          />
        </div>
      </HBlock>
    </div>
  </h-collapse>
</template>
<script>
import { default_train_data } from '@/constants/index';
export default {
  name: 'TextEncoderConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    isOpenTextEncoderCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      local_config: this.params.text_encoder,
      isOpen: this.isOpenTextEncoderCollapse
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
    handleTextEncoderCollapseChange(val) {
      if (val && !this.local_config) {
        this.addTextEncoder();
      }
    },
    addTextEncoder() {
      if (!this.local_config) {
        this.local_config = [];
      }
      this.local_config.push(JSON.parse(JSON.stringify(default_train_data.text_encoder[0])));
    },
    deleteTextEncoder(index) {
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
