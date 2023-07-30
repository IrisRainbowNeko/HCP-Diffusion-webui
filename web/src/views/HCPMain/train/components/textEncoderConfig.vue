<template>
  <h-collapse
    title="Text Encoder Config"
    showSwitch
    tooltip="train.text_encoderTip"
    :showAdd="isOpen"
    v-model="isOpen"
    showEditYaml
    :config="config.text_encoder"
    @onSwitch="(e) => $emit('open', e)"
    @add="addTextEncoder"
    @confirm="(value) => (config.text_encoder = value)"
  >
    <div
      class="block-style-item"
      v-for="(item, unet_index) in config.text_encoder || []"
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
import { storeToRefs } from 'pinia';
import { cloneDeep } from 'lodash-es';
import useTrainStore from '@/store/trainStore';
import { default_train_data } from '@/constants/index';
export default {
  name: 'TextEncoderConfig',
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
      cacheConfig: cloneDeep(default_train_data.text_encoder)
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
        this.$set(this.config, 'text_encoder', this.cacheConfig);
        if (!this.config.text_encoder || this.config.text_encoder.length == 0) {
          this.addTextEncoder();
        }
      } else {
        // 备份
        this.cacheConfig = cloneDeep(this.config.text_encoder || default_train_data.text_encoder);
        this.$set(this.config, 'text_encoder', null);
      }
      this.isOpen = val;
    }
  },
  methods: {
    addTextEncoder() {
      if (!this.config.text_encoder) {
        this.config.text_encoder = [];
      }
      this.config.text_encoder.push(cloneDeep(default_train_data.text_encoder[0]));
    },
    deleteTextEncoder(index) {
      this.config.text_encoder.splice(index, 1);
      if (this.config.text_encoder && this.config.text_encoder.length === 0) {
        this.config.text_encoder = null;
        this.isOpen = false;
      }
    }
  }
};
</script>
<style lang=""></style>
