<template>
  <h-collapse
    title="Tokenizer Pt Config"
    tooltip="train.tokenizer_ptTip"
    showEditYaml
    :config="config.tokenizer_pt"
    @confirm="(value) => (config.tokenizer_pt = value)"
  >
    <HBlock>
      <div class="config-row">
        <HConfigInput
          class="row-style"
          label="emb_dir"
          tooltip="train.tokenizer_pt.emb_dir"
          disabled
          v-model="config.tokenizer_pt.emb_dir"
        />
        <div class="config-row" style="flex: 1">
          <el-checkbox v-model="config.tokenizer_pt.replace">allow_tf32</el-checkbox>
        </div>
      </div>
      <HBlock
        label="train"
        tooltip="train.tokenizer_pt.trainTip"
        :h-index="2"
        showAdd
        @onAdd="addTokenizer_ptLogger"
        showEditYaml
        :config="config.tokenizer_pt.train"
        @confirm="(value) => this.$set(this.config, 'train', value)"
      >
        <template v-if="config.tokenizer_pt.train">
          <div
            class="block-style-item block-style-item-flex"
            v-for="(item, index) in config.tokenizer_pt.train"
            :key="`${index}-${Math.random()}`"
          >
            <div class="config-row">
              <HConfigSelect
                class="row-style"
                label="name"
                tooltip="train.tokenizer_pt.train.name"
                :options="trainStore.tokenizer_pt_train_name_options"
                v-model="item.name"
              />
              <HConfigInputNumber
                tooltip="train.tokenizer_pt.train.lr"
                class="row-style"
                label="lr"
                v-model="item.lr"
              />
            </div>
            <i class="icon icon-right el-icon-delete" @click="deleteTokenizer_ptLogger(index)"></i>
          </div>
        </template>
      </HBlock>
    </HBlock>
  </h-collapse>
</template>
<script>
import { storeToRefs } from 'pinia';
import useTrainStore from '@/store/trainStore';
import { cloneDeep } from 'lodash-es';
import { default_train_data } from '@/constants/index';
export default {
  name: 'TokenizerPtConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    const trainStore = useTrainStore();
    const { train } = storeToRefs(trainStore);
    return { trainStore, config: train };
  },
  methods: {
    addTokenizer_ptLogger() {
      if (!this.config.tokenizer_pt.train) {
        this.$set(this.config.tokenizer_pt, 'train', []);
      }
      this.config.tokenizer_pt.train.push(cloneDeep(default_train_data.tokenizer_pt.train[0]));
    },
    deleteTokenizer_ptLogger(index) {
      this.config.tokenizer_pt.train.splice(index, 1);
      if (this.config.tokenizer_pt.train.length === 0) {
        this.$set(this.config.tokenizer_pt, 'train', null);
      }
    }
  }
};
</script>
<style lang=""></style>
