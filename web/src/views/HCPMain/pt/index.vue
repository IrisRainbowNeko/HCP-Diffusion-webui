<template>
  <div class="pt-main">
    <HBlock class="pt-block outerWrapperShadow">
      <div class="config-row-header">
        <p class="pt-title">create word pt</p>
      </div>
      <div class="config-row" style="height: 60px"></div>
      <div class="config-row">
        <HConfigInput
          label="word_name"
          tooltip="pt.word_name"
          :minlength="1"
          :maxlength="100"
          v-model="params.word_name"
        />
        <HConfigInputNumber
          label="length_of_word"
          tooltip="pt.length_of_word"
          :min="1"
          :max="100"
          v-model="params.length_of_word"
        />
      </div>
      <div class="config-row">
        <HConfigInput
          tooltip="pt.init_text"
          label="init_text"
          :minlength="1"
          :maxlength="300"
          v-model="params.init_text"
        />
      </div>
      <div class="config-row">
        <el-checkbox v-model="params.replace">replace</el-checkbox>
      </div>
      <div class="config-row" style="margin-top: 40px">
        <el-button
          class="primary-btn"
          :disabled="isDisabled"
          type="primary"
          @click="handleGenerate"
        >
          Generate
        </el-button>
      </div>
    </HBlock>
  </div>
</template>
<script>
import HBlock from '@/components/HBlock.vue';
import HConfigInput from '@/components/HConfigInput.vue';
import HConfigInputNumber from '@/components/HConfigInputNumber.vue';
import { generatePtAction, getPtAction } from '@/api/generate';
import { mapGetters } from 'vuex';
export default {
  name: 'HPt',
  components: {
    HBlock,
    HConfigInput,
    HConfigInputNumber
  },
  props: {
    pretrained_model: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      params: {
        word_name: '',
        length_of_word: 1,
        init_text: '*0.017',
        replace: false
      },
      isDisabled: false
    };
  },
  computed: {
    ...mapGetters(['ptSn'])
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleGenerate() {
      const { word_name, length_of_word, init_text, replace } = this.params;
      const { pretrained_model } = this;
      if (!word_name || !pretrained_model) {
        this.$message.error('please fill in completely');
        return;
      }
      this.isDisabled = true;
      generatePtAction({
        info: {
          word_name,
          length_of_word,
          pretrained_model,
          init_text,
          replace
        }
      })
        .then((result) => {
          const { sn } = result;
          this.$store.commit('setPtSnSn', sn);
          this.$message.success('create word pt is running now, please waiting...');
        })
        .catch(() => {
          this.$message.error('operation failed');
        })
        .finally(() => {
          this.isDisabled = false;
        });
    },
    fetchData() {
      getPtAction(this.ptSn)
        .then((result) => {
          console.log(result);
        })
        .catch(() => {
          this.$message.error('operation failed');
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.pt-main {
  height: 100%;
  width: 100%;
  @include flexLayout(column);
  align-items: center;
  justify-content: center;
  .pt-block {
    width: 340px;
    flex: inherit;
    position: relative;
    top: -50px;
    .config-row {
      ::v-deep .label {
        padding: 4px 0 14px 3px;
      }
    }
  }
}
.config-row-header {
  @include flexLayout(row, 0, center, center);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 60px;
  background: $tabColor;
  padding-left: 10px;
  font-size: 18px;
}
</style>
