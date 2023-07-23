<template>
  <h-collapse
    title="Tokenizer Pt Config"
    tooltip="train.tokenizer_ptTip"
    showEditYaml
    :config="local_config"
    @confirm="(value) => (local_config = value)"
  >
    <HBlock>
      <div class="config-row">
        <HConfigInput
          class="row-style"
          label="emb_dir"
          tooltip="train.tokenizer_pt.emb_dir"
          disabled
          v-model="local_config.emb_dir"
        />
        <div class="config-row" style="flex: 1">
          <el-checkbox v-model="local_config.replace">allow_tf32</el-checkbox>
        </div>
      </div>
      <HBlock
        label="train"
        tooltip="train.tokenizer_pt.trainTip"
        :h-index="2"
        showAdd
        @onAdd="addTokenizer_ptLogger"
        showEditYaml
        :config="local_config.train"
        @confirm="(value) => this.$set(this.local_config, 'train', value)"
      >
        <template v-if="local_config.train">
          <div
            class="block-style-item block-style-item-flex"
            v-for="(item, index) in local_config.train"
            :key="`${index}-${Math.random()}`"
          >
            <div class="config-row">
              <HConfigSelect
                class="row-style"
                label="name"
                tooltip="train.tokenizer_pt.train.name"
                :options="tokenizer_pt_train_name_options"
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
import { default_train_data } from '@/constants/index';
import { handleOptions } from '@/utils/index';
import { getTrain } from '@/api/train';
export default {
  name: 'TokenizerPtConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      local_config: this.params.tokenizer_pt,
      tokenizer_pt_train_name_options: []
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
  provide() {
    return {
      configValue: () => this.local_config
    };
  },
  methods: {
    addTokenizer_ptLogger() {
      if (!this.local_config.train) {
        this.$set(this.local_config, 'train', []);
      }
      this.local_config.train.push(
        JSON.parse(JSON.stringify(default_train_data.tokenizer_pt.train[0]))
      );
      this.$forceUpdate();
    },
    deleteTokenizer_ptLogger(index) {
      this.local_config.train.splice(index, 1);
      if (this.local_config.train.length === 0) {
        this.$set(this.local_config, 'train', null);
      }
    },
    async initData() {
      const result = await getTrain(this.trainSn).catch((err) => {
        this.$message.error(err);
      });
      if (!result) return;
      const { tokenizer_pt_train_name = [] } = result;
      this.tokenizer_pt_train_name_options = handleOptions(tokenizer_pt_train_name);
    }
  }
};
</script>
<style lang=""></style>
