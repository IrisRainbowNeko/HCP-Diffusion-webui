<template>
  <h-collapse
    title="Lora Unet Config"
    showSwitch
    tooltip="train.lora_unetTip"
    :showAdd="isOpen"
    v-model="isOpen"
    showEditYaml
    :config="config.lora_unet"
    @onSwitch="(e) => $emit('open', e)"
    @add="addLora_unet"
    @confirm="(value) => (config.lora_unet = value)"
  >
    <div class="block-style-item" v-for="(item, index) in config.lora_unet || []" :key="index">
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
import { storeToRefs } from 'pinia';
import { cloneDeep } from 'lodash-es';
import useTrainStore from '@/store/trainStore';
import { default_train_data, lora_unet_default_value } from '@/constants/index';
export default {
  name: 'LoraUnetConfig',
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
      cacheConfig: cloneDeep(default_train_data.lora_unet)
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
        this.$set(this.config, 'lora_unet', this.cacheConfig);
        if (!this.config.lora_unet || this.config.lora_unet.length == 0) {
          this.addLora_unet();
        }
      } else {
        // 备份
        this.cacheConfig = cloneDeep(this.config.lora_unet || default_train_data.lora_unet);
        this.$set(this.config, 'lora_unet', null);
      }
      this.isOpen = val;
    }
  },
  methods: {
    addLora_unet() {
      if (!this.config.lora_unet) {
        this.config.lora_unet = [];
      }
      this.config.lora_unet.push(cloneDeep(lora_unet_default_value));
    },
    deleteLora_unet(index) {
      this.config.lora_unet.splice(index, 1);
      if (this.config.lora_unet.length === 0) {
        this.config.lora_unet = null;
        this.isOpen = false;
      }
    }
  }
};
</script>
<style lang=""></style>
