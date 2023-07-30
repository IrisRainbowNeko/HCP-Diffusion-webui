<template>
  <h-collapse
    title="Model Config"
    tooltip="train.modelTip"
    showEditYaml
    :config="config.model"
    @confirm="(value) => (config.model = value)"
  >
    <HBlock>
      <div class="config-row">
        <HConfigSelect
          tooltip="train.model.pretrained_model_name_or_path"
          class="row-style"
          label="pretrained_model_name_or_path"
          :options="trainStore.pretrained_model_name_or_path_options"
          v-model="trainStore.pretrained_model_name_or_path"
        />
        <HConfigInputNumber
          class="row-style"
          label="clip_skip"
          tooltip="train.model.clip_skip"
          :min="0"
          :max="4"
          v-model="config.model.clip_skip"
        />
      </div>
      <div class="config-row">
        <HConfigInputNumber
          class="row-style"
          label="ema_text_encoder"
          tooltip="train.model.ema_text_encoder"
          :min="0"
          :max="1"
          :step="0.01"
          v-model="config.model.ema_text_encoder"
        />
        <HConfigInputNumber
          class="row-style"
          label="ema_unet"
          tooltip="train.model.ema_unet"
          :min="0"
          :max="1"
          :step="0.01"
          v-model="config.model.ema_unet"
        />
      </div>
      <div class="config-row">
        <div class="config-row" style="flex: 1">
          <el-checkbox v-model="config.model.enable_xformers">enable_xformers</el-checkbox>
          <el-checkbox v-model="config.model.gradient_checkpointing">
            gradient_checkpointing
          </el-checkbox>
        </div>
        <HConfigRange
          label="tokenizer_repeats"
          tooltip="train.model.tokenizer_repeats"
          :min="1"
          :max="5"
          integer
          v-model="config.model.tokenizer_repeats"
        />
      </div>
    </HBlock>
  </h-collapse>
</template>
<script>
import { storeToRefs } from 'pinia';
import useTrainStore from '@/store/trainStore';
export default {
  name: 'ModelConfig',
  setup() {
    const trainStore = useTrainStore();
    const { train } = storeToRefs(trainStore);
    return { trainStore, config: train };
  }
};
</script>
<style lang=""></style>
