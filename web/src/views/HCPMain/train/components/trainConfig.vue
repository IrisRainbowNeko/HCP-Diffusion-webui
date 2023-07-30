<template>
  <h-collapse
    title="Train Config"
    tooltip="train.trainTip"
    showEditYaml
    :config="config.train"
    @confirm="(value) => (config.train = value)"
  >
    <HBlock>
      <div class="config-row">
        <HConfigInputNumber
          class="row-style"
          label="train_steps"
          tooltip="train.train.train_steps"
          :max="1000000"
          v-model="config.train.train_steps"
        />
        <HConfigInputNumber
          class="row-style"
          label="max_grad_norm"
          tooltip="train.train.max_grad_norm"
          disabled
          v-model="config.train.max_grad_norm"
        />
      </div>
      <div class="config-row">
        <HConfigRange
          label="workers"
          tooltip="train.train.workers"
          :min="0"
          :max="12"
          v-model="config.train.workers"
        />
        <HConfigRange
          label="gradient_accumulation_steps"
          tooltip="train.train.gradient_accumulation_steps"
          :min="1"
          :max="32"
          v-model="config.train.gradient_accumulation_steps"
        />
      </div>
      <div class="config-row">
        <el-checkbox v-model="config.train.set_grads_to_none">set_grads_to_none</el-checkbox>
        <el-checkbox v-model="config.train.scale_lr_pt">scale_lr_pt</el-checkbox>
        <el-checkbox v-model="config.train.scale_lr">scale_lr</el-checkbox>
      </div>
      <div class="config-row">
        <HConfigInputNumber
          class="row-style"
          label="save_step"
          tooltip="train.train.save_step"
          :max="config.train.train_steps"
          v-model="config.train.save_step"
        />
        <HConfigInput
          class="row-style"
          label="cfg_scale"
          tooltip="train.train.cfg_scale"
          v-model="config.train.cfg_scale"
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
          :config="config.train.optimizer"
          @confirm="(value) => (config.train = value)"
        >
          <div class="config-row">
            <HConfigSelect
              label="criterion"
              class="row-style"
              tooltip="train.train.optimizer._target_"
              :options="optimizer_types_options"
              v-model="config.train.optimizer._target_"
            />
            <HConfigInputNumber
              class="row-style"
              label="weight_decay"
              :min="0"
              :max="1"
              :step="0.001"
              tooltip="train.train.optimizer.weight_decay"
              v-model="config.train.optimizer.weight_decay"
            />
          </div>
        </HBlock>
        <HBlock
          label="optimizer_pt"
          :h-index="2"
          tooltip="train.train.optimizer_ptTip"
          showEditYaml
          :config="config.train.optimizer_pt"
          @confirm="(value) => (config.train = value)"
        >
          <div class="config-row">
            <HConfigSelect
              label="criterion"
              class="row-style"
              tooltip="train.train.optimizer_pt._target_"
              :options="optimizer_types_options"
              v-model="config.train.optimizer_pt._target_"
            />
            <HConfigInputNumber
              class="row-style"
              label="weight_decay"
              :min="0"
              :max="1"
              :step="0.0001"
              tooltip="train.train.optimizer_pt.weight_decay"
              v-model="config.train.optimizer_pt.weight_decay"
            />
          </div>
        </HBlock>
      </div>
      <HBlock
        label="loss"
        :h-index="2"
        tooltip="train.train.lossTip"
        showEditYaml
        :config="config.train.loss"
        @confirm="(value) => (config.train = value)"
      >
        <div class="config-row">
          <HConfigSelect
            label="criterion"
            class="row-style"
            tooltip="train.train.loss.criterion"
            :options="lossConfigKeys"
            v-model="lossConfig"
          />
          <HConfigSelect
            label="type"
            class="row-style"
            tooltip="train.train.loss.type"
            :options="[
              { label: 'eps', value: 'eps' },
              { label: 'sample', value: 'sample' }
            ]"
            v-model="config.train.loss.type"
          />
        </div>
        <div class="config-row">
          <HConfigRange
            label="gamma"
            tooltip="train.train.loss.gamma"
            v-if="lossConfig === 'hcpdiff.loss.MinSNRLoss'"
            v-model="config.train.loss.criterion.gamma"
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
        :config="config.train.scheduler"
        @confirm="(value) => (config.train = value)"
      >
        <div class="config-row">
          <HConfigSelect
            class="row-style"
            label="name"
            tooltip="train.train.scheduler.name"
            :options="scheduler_name_options"
            v-model="config.train.scheduler.name"
          />
          <HConfigInputNumber
            class="row-style"
            label="num_warmup_steps"
            :min="0"
            :max="config.train.train_steps"
            tooltip="train.train.scheduler.num_warmup_steps"
            v-model="config.train.scheduler.num_warmup_steps"
          />
        </div>
        <div class="config-row">
          <HConfigInputNumber
            class="row-style"
            label="num_training_steps"
            :default-value="config.train.train_steps"
            tooltip="train.train.scheduler.num_training_steps"
            v-model="config.train.scheduler.num_training_steps"
          />
        </div>
        <HBlock
          :h-index="3"
          label="scheduler_kwargs"
          tooltip="train.train.scheduler.scheduler_kwargs"
        >
          <EditWordName
            title="编辑scheduler_kwargs"
            :value="config.train.scheduler.scheduler_kwargs"
            @confirm="(e) => confirmChangeSchedulerKwargs(e, 'scheduler')"
          />
        </HBlock>
      </HBlock>
      <HBlock
        label="scheduler_pt"
        :h-index="2"
        tooltip="train.train.scheduler_ptTip"
        showEditYaml
        :config="config.train.scheduler_pt"
        @confirm="(value) => (config.train = value)"
      >
        <div class="config-row">
          <HConfigSelect
            class="row-style"
            label="name"
            :options="scheduler_name_options"
            tooltip="train.train.scheduler_pt.name"
            v-model="config.train.scheduler_pt.name"
          />
          <HConfigInputNumber
            class="row-style"
            label="num_warmup_steps"
            :min="0"
            :max="config.train.train_steps"
            tooltip="train.train.scheduler_pt.num_warmup_steps"
            v-model="config.train.scheduler_pt.num_warmup_steps"
          />
        </div>
        <div class="config-row">
          <HConfigInputNumber
            class="row-style"
            label="num_training_steps"
            :default-value="config.train.train_steps"
            tooltip="train.train.scheduler_pt.num_training_steps"
            v-model="config.train.scheduler_pt.num_training_steps"
          />
        </div>
        <HBlock
          :h-index="3"
          label="scheduler_kwargs"
          tooltip="train.train.scheduler_pt.scheduler_kwargs"
        >
          <EditWordName
            title="编辑scheduler_kwargs"
            :value="config.train.scheduler_pt.scheduler_kwargs"
            @confirm="(e) => confirmChangeSchedulerKwargs(e, 'scheduler_pt')"
          />
        </HBlock>
      </HBlock>
    </HBlock>
  </h-collapse>
</template>
<script>
import { storeToRefs } from 'pinia';
import { cloneDeep } from 'lodash-es';
import useTrainStore from '@/store/trainStore';
import EditWordName from './editWordName.vue';
import {
  optimizer_types_options,
  scheduler_name_options,
  lossConfigKeys,
  lossConfigs
} from '@/constants/index';
export default {
  name: 'TrainConfig',
  components: {
    EditWordName
  },
  data() {
    return {
      lossConfig: '',
      optimizer_types_options,
      scheduler_name_options,
      lossConfigKeys
    };
  },
  setup() {
    const trainStore = useTrainStore();
    const { train } = storeToRefs(trainStore);
    return { trainStore, config: train };
  },
  watch: {
    lossConfig(val) {
      this.config.train.loss.criterion = cloneDeep(lossConfigs[val]);
    },
    'config.train.loss.criterion._target_': function (val) {
      const lossConfig = lossConfigs[val];
      if (lossConfig) {
        this.lossConfig = val;
      } else {
        this.lossConfig = lossConfigKeys[0].value;
      }
    }
  },
  methods: {
    confirmChangeSchedulerKwargs(value, key) {
      this.$set(this.config.train[key], 'scheduler_kwargs', value);
    }
  }
};
</script>
<style lang=""></style>
