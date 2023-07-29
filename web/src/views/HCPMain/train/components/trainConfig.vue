<template>
  <h-collapse
    title="Train Config"
    tooltip="train.trainTip"
    showEditYaml
    :config="local_config"
    @confirm="(value) => (local_config = value)"
  >
    <HBlock>
      <div class="config-row">
        <HConfigInputNumber
          class="row-style"
          label="train_steps"
          tooltip="train.train.train_steps"
          :max="1000000"
          v-model="local_config.train_steps"
        />
        <HConfigInputNumber
          class="row-style"
          label="max_grad_norm"
          tooltip="train.train.max_grad_norm"
          disabled
          v-model="local_config.max_grad_norm"
        />
      </div>
      <div class="config-row">
        <HConfigRange
          label="workers"
          tooltip="train.train.workers"
          :min="0"
          :max="12"
          v-model="local_config.workers"
        />
        <HConfigRange
          label="gradient_accumulation_steps"
          tooltip="train.train.gradient_accumulation_steps"
          :min="1"
          :max="32"
          v-model="local_config.gradient_accumulation_steps"
        />
      </div>
      <div class="config-row">
        <el-checkbox v-model="local_config.set_grads_to_none">set_grads_to_none</el-checkbox>
        <el-checkbox v-model="local_config.scale_lr_pt">scale_lr_pt</el-checkbox>
        <el-checkbox v-model="local_config.scale_lr">scale_lr</el-checkbox>
      </div>
      <div class="config-row">
        <HConfigInputNumber
          class="row-style"
          label="save_step"
          tooltip="train.train.save_step"
          :max="local_config.train_steps"
          v-model="local_config.save_step"
        />
        <HConfigInput
          class="row-style"
          label="cfg_scale"
          tooltip="train.train.cfg_scale"
          v-model="local_config.cfg_scale"
        />
      </div>

      <!-- TODO: 讨论后决定 待定 -->
      <!-- <HBlock label="resume">
                  <div class="config-row">暂时无返回值 待处理...</div>
                </HBlock> -->
      <div style="display: flex; gap: 20px">
        <HBlock
          label="optimizer"
          :h-index="2"
          tooltip="train.train.optimizerTip"
          showEditYaml
          :config="local_config.optimizer"
          @confirm="(value) => (local_config = value)"
        >
          <div class="config-row">
            <HConfigSelect
              label="criterion"
              class="row-style"
              tooltip="train.train.optimizer._target_"
              :options="optimizer_types_options"
              v-model="local_config.optimizer._target_"
            />
            <HConfigInputNumber
              class="row-style"
              label="weight_decay"
              :min="0"
              :max="1"
              :step="0.001"
              tooltip="train.train.optimizer.weight_decay"
              v-model="local_config.optimizer.weight_decay"
            />
          </div>
        </HBlock>
        <HBlock
          label="optimizer_pt"
          :h-index="2"
          tooltip="train.train.optimizer_ptTip"
          showEditYaml
          :config="local_config.optimizer_pt"
          @confirm="(value) => (local_config = value)"
        >
          <div class="config-row">
            <HConfigSelect
              label="criterion"
              class="row-style"
              tooltip="train.train.optimizer_pt._target_"
              :options="optimizer_types_options"
              v-model="local_config.optimizer_pt._target_"
            />
            <HConfigInputNumber
              class="row-style"
              label="weight_decay"
              :min="0"
              :max="1"
              :step="0.0001"
              tooltip="train.train.optimizer_pt.weight_decay"
              v-model="local_config.optimizer_pt.weight_decay"
            />
          </div>
        </HBlock>
      </div>
      <HBlock
        label="loss"
        :h-index="2"
        tooltip="train.train.lossTip"
        showEditYaml
        :config="local_config.loss"
        @confirm="(value) => (local_config = value)"
      >
        <div class="config-row">
          <HConfigSelect
            label="criterion"
            class="row-style"
            tooltip="train.train.loss.criterion"
            :options="lossConfigKeys"
            v-model="loss_config"
          />
          <HConfigSelect
            label="type"
            class="row-style"
            tooltip="train.train.loss.type"
            :options="[
              { label: 'eps', value: 'eps' },
              { label: 'sample', value: 'sample' }
            ]"
            v-model="local_config.loss.type"
          />
        </div>
        <div class="config-row">
          <HConfigRange
            label="gamma"
            tooltip="train.train.loss.gamma"
            v-if="loss_config === 'hcpdiff.loss.MinSNRLoss'"
            v-model="local_config.loss.criterion.gamma"
            :min="0.5"
            :max="10"
            :step="0.1"
          />
        </div>
      </HBlock>
      <HBlock
        label="scheduler"
        :h-index="2"
        tooltip="train.train.schedulerTip"
        showEditYaml
        :config="local_config.scheduler"
        @confirm="(value) => (local_config = value)"
      >
        <div class="config-row">
          <HConfigSelect
            class="row-style"
            label="name"
            tooltip="train.train.scheduler.name"
            :options="scheduler_name_options"
            v-model="local_config.scheduler.name"
          />
          <HConfigInputNumber
            class="row-style"
            label="num_warmup_steps"
            :min="0"
            :max="local_config.train_steps"
            tooltip="train.train.scheduler.num_warmup_steps"
            v-model="local_config.scheduler.num_warmup_steps"
          />
        </div>
        <div class="config-row">
          <HConfigInputNumber
            class="row-style"
            label="num_training_steps"
            :default-value="local_config.train_steps"
            tooltip="train.train.scheduler.num_training_steps"
            v-model="local_config.scheduler.num_training_steps"
          />
        </div>
        <HBlock
          :h-index="3"
          label="scheduler_kwargs"
          tooltip="train.train.scheduler.scheduler_kwargs"
        >
          <EditWordName
            title="编辑scheduler_kwargs"
            :value="local_config.scheduler.scheduler_kwargs"
            @confirm="(e) => confirmChangeSchedulerKwargs(e, 'scheduler')"
          />
        </HBlock>
      </HBlock>
      <HBlock
        label="scheduler_pt"
        :h-index="2"
        tooltip="train.train.scheduler_ptTip"
        showEditYaml
        :config="local_config.scheduler_pt"
        @confirm="(value) => (local_config = value)"
      >
        <div class="config-row">
          <HConfigSelect
            class="row-style"
            label="name"
            :options="scheduler_name_options"
            tooltip="train.train.scheduler_pt.name"
            v-model="local_config.scheduler_pt.name"
          />
          <HConfigInputNumber
            class="row-style"
            label="num_warmup_steps"
            :min="0"
            :max="local_config.train_steps"
            tooltip="train.train.scheduler_pt.num_warmup_steps"
            v-model="local_config.scheduler_pt.num_warmup_steps"
          />
        </div>
        <div class="config-row">
          <HConfigInputNumber
            class="row-style"
            label="num_training_steps"
            :default-value="local_config.train_steps"
            tooltip="train.train.scheduler_pt.num_training_steps"
            v-model="local_config.scheduler_pt.num_training_steps"
          />
        </div>
        <HBlock
          :h-index="3"
          label="scheduler_kwargs"
          tooltip="train.train.scheduler_pt.scheduler_kwargs"
        >
          <EditWordName
            title="编辑scheduler_kwargs"
            :value="local_config.scheduler_pt.scheduler_kwargs"
            @confirm="(e) => confirmChangeSchedulerKwargs(e, 'scheduler_pt')"
          />
        </HBlock>
      </HBlock>
    </HBlock>
  </h-collapse>
</template>
<script>
import EditWordName from './editWordName.vue';
import { handleOptions } from '@/utils/index';
import { getTrain } from '@/api/train';
import { optimizer_types_options, scheduler_name_options, lossConfigKeys } from '@/constants/index';
export default {
  name: 'TrainConfig',
  components: {
    EditWordName
  },
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    lossConfig: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      optimizer_types_options,
      scheduler_name_options,
      lossConfigKeys,
      local_config: this.params.train,
      loss_config: this.lossConfig
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
    confirmChangeSchedulerKwargs(value, key) {
      this.$set(this.local_config[key], 'scheduler_kwargs', value);
    },
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
