<template>
  <h-collapse
    title="Unet Config"
    showSwitch
    tooltip="train.unetTip"
    :showAdd="isOpen"
    v-model="isOpen"
    showEditYaml
    :config="config.unet"
    @onSwitch="(e) => $emit('open', e)"
    @add="addUnet"
    @confirm="(value) => (config.unet = value)"
  >
    <HBlock
      :h-index="2"
      label=" "
      show-icon
      v-for="(item, unet_index) in config.unet || []"
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
import { storeToRefs } from 'pinia';
import { cloneDeep } from 'lodash-es';
import useTrainStore from '@/store/trainStore';
import { default_train_data } from '@/constants/index';
export default {
  name: 'UnetConfig',
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
      cacheConfig: cloneDeep(default_train_data.unet)
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
        this.$set(this.config, 'unet', this.cacheConfig);
        if (!this.config.unet || this.config.unet.length == 0) {
          this.addUnet();
        }
      } else {
        // 备份
        this.cacheConfig = cloneDeep(this.config.unet || default_train_data.unet);
        this.$set(this.config, 'unet', null);
      }
      this.isOpen = val;
    }
  },
  methods: {
    addUnet() {
      if (!this.config.unet) {
        this.config.unet = [];
      }
      this.config.unet.push(cloneDeep(default_train_data.unet[0]));
    },
    deleteUnet(unet_index) {
      this.config.unet.splice(unet_index, 1);
      if (this.config.unet && this.config.unet.length === 0) {
        this.config.unet = null;
        this.isOpen = false;
      }
    }
  }
};
</script>
<style lang=""></style>
