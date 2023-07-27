<template>
  <h-collapse
    title="Model Config"
    tooltip="train.modelTip"
    showEditYaml
    :config="local_config"
    @confirm="(value) => (local_config = value)"
  >
    <HBlock>
      <div class="config-row">
        <HConfigSelect
          tooltip="train.model.pretrained_model_name_or_path"
          class="row-style"
          label="pretrained_model_name_or_path"
          :options="pretrained_model_name_or_path_options"
          v-model="local_config.pretrained_model_name_or_path"
        />
        <HConfigInputNumber
          class="row-style"
          label="clip_skip"
          tooltip="train.model.clip_skip"
          :min="0"
          :max="4"
          v-model="local_config.clip_skip"
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
          v-model="local_config.ema_text_encoder"
        />
        <HConfigInputNumber
          class="row-style"
          label="ema_unet"
          tooltip="train.model.ema_unet"
          :min="0"
          :max="1"
          :step="0.01"
          v-model="local_config.ema_unet"
        />
      </div>
      <div class="config-row">
        <div class="config-row" style="flex: 1">
          <el-checkbox v-model="local_config.enable_xformers">enable_xformers</el-checkbox>
          <el-checkbox v-model="local_config.gradient_checkpointing">
            gradient_checkpointing
          </el-checkbox>
        </div>
        <HConfigRange
          label="tokenizer_repeats"
          tooltip="train.model.tokenizer_repeats"
          :min="1"
          :max="5"
          integer
          v-model="local_config.tokenizer_repeats"
        />
      </div>
    </HBlock>
  </h-collapse>
</template>
<script>
import { handleOptions } from '@/utils/index';
import { getTrain } from '@/api/train';
export default {
  name: 'ModelConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pretrained_model_name_or_path_options: [],
      local_config: this.params.model
    };
  },
  watch: {
    local_config: {
      handler(val) {
        this.$emit('updateData', val);
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      const result = await getTrain(this.trainSn).catch((err) => {
        this.$message.error(err);
      });
      if (!result) return;
      const { pretrained_model_name_or_path = [] } = result;
      this.pretrained_model_name_or_path_options = handleOptions(pretrained_model_name_or_path);
    }
  }
};
</script>
<style lang=""></style>
