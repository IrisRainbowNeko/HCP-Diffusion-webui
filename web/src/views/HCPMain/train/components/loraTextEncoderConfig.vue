<template>
  <h-collapse
    title="Lora Text Encoder Config"
    showSwitch
    tooltip="train.lora_text_encoderTip"
    :showAdd="isOpen"
    v-model="isOpen"
    showEditYaml
    :config="config.lora_text_encoder"
    @onSwitch="(e) => $emit('open', e)"
    @add="addLora_text_encoder"
    @confirm="(value) => (config.lora_text_encoder = value)"
  >
    <HBlock
      :h-index="2"
      label=" "
      v-for="(item, index) in config.lora_text_encoder || []"
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
import { storeToRefs } from 'pinia';
import { cloneDeep } from 'lodash-es';
import useTrainStore from '@/store/trainStore';
import { default_train_data, default_lora_text_encoder_value } from '@/constants/index';
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
      cacheConfig: cloneDeep(default_train_data.lora_text_encoder)
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
        this.$set(this.config, 'lora_text_encoder', this.cacheConfig);
        if (!this.config.lora_text_encoder || this.config.lora_text_encoder.length == 0) {
          this.addLora_text_encoder();
        }
      } else {
        // 备份
        this.cacheConfig = cloneDeep(
          this.config.lora_text_encoder || default_train_data.lora_text_encoder
        );
        this.$set(this.config, 'lora_text_encoder', null);
      }
      this.isOpen = val;
    }
  },
  methods: {
    addLora_text_encoder() {
      if (!this.config.lora_text_encoder) {
        this.config.lora_text_encoder = [];
      }
      this.config.lora_text_encoder.push(cloneDeep(default_lora_text_encoder_value));
    },
    deleteLora_text_encoder(index) {
      this.config.lora_text_encoder.splice(index, 1);
      if (this.config.lora_text_encoder && this.config.lora_text_encoder.length === 0) {
        this.config.lora_text_encoder = null;
        this.isOpen = false;
      }
    }
  }
};
</script>
<style lang=""></style>
