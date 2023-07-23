<template>
  <h-collapse
    class="data-collapse-wrapper"
    title="Data Config"
    showAdd
    showPre
    showNext
    tooltip="train.dataTip"
    :nextDisabled="datasetIndex === datasetList.length - 1"
    :preDisabled="datasetIndex === 0"
    @add="addDateset"
    @pre="handlerPreDataset"
    @next="handlerNextDataset"
    showEditYaml
    :config="local_config"
    @confirm="confirmYamlEditY"
  >
    <HBlock>
      <!-- dataset1 -->
      <template v-if="datasetList && datasetList.length">
        <el-carousel
          ref="dataCarouselRef"
          :autoplay="false"
          :initial-index="datasetIndex"
          arrow="never"
          :height="`${tabHeight}px`"
        >
          <el-carousel-item
            v-for="(dataset, index) in datasetList"
            :key="`${index}-${Math.random()}`"
            @scroll.native="saveScrollPosition(index)"
          >
            <HBlock
              :h-index="2"
              :label="dataset"
              :ref="`dataset-${index}`"
              :show-icon="datasetList.length > 1"
              tooltip="train.data.datasetTip"
              @onDelete="deleteDataset(dataset)"
              showEditYaml
              :config="local_config[dataset]"
              @confirm="(value) => this.$set(this.local_config, dataset, value)"
            >
              <div class="config-row">
                <HConfigInput
                  class="row-style"
                  label="_target_"
                  disabled
                  tooltip="train.data.dataset._target_"
                  v-model="local_config[dataset]._target_"
                />
                <div class="config-row" style="flex: 1">
                  <el-checkbox v-model="local_config[dataset].cache_latents">
                    cache_latents
                  </el-checkbox>
                  <el-checkbox v-model="local_config[dataset].att_mask_encode">
                    att_mask_encode
                  </el-checkbox>
                </div>
              </div>
              <div class="config-row">
                <HConfigInputNumber
                  class="row-style"
                  label="batch_size"
                  :min="1"
                  :max="100"
                  tooltip="train.data.dataset.batch_size"
                  v-model="local_config[dataset].batch_size"
                />
                <HConfigInputNumber
                  class="row-style"
                  label="loss_weight"
                  :min="0"
                  :max="10"
                  :step="0.01"
                  tooltip="train.data.dataset.loss_weight"
                  v-model="local_config[dataset].loss_weight"
                />
              </div>
              <!-- bucket -->
              <HBlock
                label="bucket"
                tooltip="train.data.dataset.bucketTip"
                :h-index="3"
                showEditYaml
                :config="local_config[dataset].bucket"
                @confirm="(value) => this.$set(this.local_config[dataset], bucket, value)"
              >
                <div class="config-row">
                  <HConfigSelect
                    class="row-style"
                    label="_target_"
                    tooltip="train.data.dataset.bucket._target_"
                    :options="bucket__target__options"
                    v-model="local_config[dataset].bucket._target_"
                    @onChange="(e) => handlerBucketTargetChange(dataset, e)"
                  />
                  <template
                    v-if="
                      local_config[dataset].bucket._target_ ===
                      'hcpdiff.data.bucket.RatioBucket.from_files'
                    "
                  >
                    <HConfigRange
                      label="num_bucket"
                      :min="1"
                      :max="10"
                      :step="1"
                      integer
                      tooltip="train.data.dataset.bucket.num_bucket"
                      v-model="local_config[dataset].bucket.num_bucket"
                    />
                  </template>
                  <div
                    class="config-row"
                    v-if="
                      local_config[dataset].bucket._target_ === 'hcpdiff.data.bucket.FixedBucket' &&
                      local_config[dataset].bucket.target_size
                    "
                  >
                    <HConfigInputNumber
                      label="target_size"
                      class="row-style"
                      tooltip="train.data.dataset.bucket.target_size"
                      v-model="local_config[dataset].bucket.target_size[0]"
                    />
                    <HConfigInputNumber v-model="local_config[dataset].bucket.target_size[1]" />
                  </div>
                </div>
                <HBlock
                  :h-index="4"
                  label="target_area"
                  tooltip="train.data.dataset.bucket.target_areaTip"
                  v-if="
                    local_config[dataset].bucket._target_ ===
                      'hcpdiff.data.bucket.RatioBucket.from_files' &&
                    local_config[dataset].bucket.target_area
                  "
                >
                  <div class="config-row">
                    <HConfigInput
                      class="row-style"
                      label="_target_"
                      tooltip="train.data.dataset.bucket.target_area._target_"
                      v-model="local_config[dataset].bucket.target_area._target_"
                    />
                    <HConfigInputSum
                      class="row-style"
                      label="_args_"
                      tooltip="train.data.dataset.bucket.target_area._args_"
                      v-model="local_config[dataset].bucket.target_area._args_"
                    />
                  </div>
                </HBlock>
              </HBlock>
              <!-- source -->
              <HBlock
                label="source"
                :h-index="3"
                showAdd
                tooltip="train.data.dataset.sourceTip"
                @onAdd="addDataSourceData_source(dataset)"
                showEditYaml
                :config="local_config[dataset].source"
                @confirm="(value) => this.$set(this.local_config[dataset], source, value)"
              >
                <!-- data_source1\ data_source2 -->
                <HBlock
                  style="position: relative"
                  :h-index="4"
                  v-for="{ source, key } in dataSourceList(dataset)"
                  :label="source"
                  :key="key"
                  :show-icon="dataSourceList(dataset).length > 1"
                  tooltip="train.data.dataset.source.data_sourceTip"
                  @onDelete="deleteDataSourceData_source(dataset, source)"
                  showEditYaml
                  :config="local_config[dataset].source[source]"
                  @confirm="(value) => this.$set(this.local_config[dataset].source, source, value)"
                >
                  <div class="config-row">
                    <HConfigInput
                      class="row-style"
                      label="img_root"
                      tooltip="train.data.dataset.source.data_source.img_root"
                      v-model="local_config[dataset].source[source].img_root"
                    />
                    <HConfigInput
                      class="row-style"
                      label="att_mask"
                      tooltip="train.data.dataset.source.data_source.att_mask"
                      v-model="local_config[dataset].source[source].att_mask"
                    />
                  </div>
                  <div class="config-row">
                    <HConfigSelect
                      class="row-style"
                      label="prompt_template"
                      :options="prompt_template_options"
                      tooltip="train.data.dataset.source.data_source.prompt_template"
                      v-model="local_config[dataset].source[source].prompt_template"
                    />
                    <HConfigInput
                      class="row-style"
                      label="caption_file"
                      tooltip="train.data.dataset.source.data_source.caption_file"
                      v-model="local_config[dataset].source[source].caption_file"
                    />
                  </div>

                  <!-- image_transforms -->
                  <HBlock
                    :h-index="5"
                    class="image-transforms"
                    label="image_transforms"
                    tooltip="train.data.dataset.source.data_source.image_transformsTip"
                    show-add
                    @onAdd="addImgTransforms(dataset, source)"
                    @onSwitch="(e) => handleImgTransformsChange(dataset, source, e)"
                    showEditYaml
                    :config="local_config[dataset].source[source].image_transforms"
                    @confirm="
                      (value) =>
                        this.$set(
                          this.local_config[dataset].source[source],
                          image_transforms,
                          value
                        )
                    "
                  >
                    <template
                      v-if="local_config[dataset].source[source].image_transforms.transforms"
                    >
                      <HBlock
                        style="margin-top: 10px"
                        v-for="(item, index) in local_config[dataset].source[source]
                          .image_transforms.transforms || []"
                        :key="item._target_ + index"
                        :h-index="6"
                        :label="`transforms-${index}`"
                        :showIcon="
                          local_config[dataset].source[source].image_transforms.transforms.length >
                          1
                        "
                        tooltip="train.data.dataset.source.data_source.image_transformsTip"
                        @onDelete="deleteImgTransforms(dataset, source, index)"
                      >
                        <div class="config-row">
                          <HConfigSelect
                            class="row-style"
                            label="_target_"
                            :options="imgTransformsConfig"
                            v-model="item._target_"
                            tooltip="train.data.dataset.source.data_source.image_transforms._target_"
                            @onChange="(e) => handlerChangeImgTransforms(dataset, source, index, e)"
                          />
                          <template
                            v-if="
                              [
                                'torchvision.transforms.Resize',
                                'torchvision.transforms.CenterCrop',
                                'torchvision.transforms.RandomCrop'
                              ].includes(item._target_)
                            "
                          >
                            <HConfigTagSelect
                              class="row-style"
                              label="size"
                              tooltip="train.data.dataset.source.data_source.image_transforms.transforms.size"
                              v-model="item.size"
                            />
                          </template>
                          <template
                            v-if="item._target_ === 'torchvision.transforms.RandomGrayscale'"
                          >
                            <HConfigInputNumber
                              class="row-style"
                              label="p"
                              :min="0"
                              :max="1"
                              :step="0.01"
                              tooltip="train.data.dataset.source.data_source.image_transforms.transforms.p"
                              v-model="item.p"
                            />
                          </template>
                        </div>

                        <template v-if="item._target_ === 'torchvision.transforms.Normalize'">
                          <div class="config-row">
                            <HConfigTagSelect
                              class="row-style"
                              label="mean"
                              tooltip="train.data.dataset.source.data_source.image_transforms.transforms.mean"
                              v-model="item.mean"
                            />
                            <HConfigTagSelect
                              class="row-style"
                              label="std"
                              tooltip="train.data.dataset.source.data_source.image_transforms.transforms.std"
                              v-model="item.std"
                            />
                          </div>
                        </template>
                        <template v-if="item._target_ === 'torchvision.transforms.ColorJitter'">
                          <div class="config-row">
                            <HConfigTagSelect
                              class="row-style"
                              label="brightness"
                              tooltip="train.data.dataset.source.data_source.image_transforms.transforms.brightness"
                              v-model="item.brightness"
                            />
                            <HConfigTagSelect
                              class="row-style"
                              label="contrast"
                              tooltip="train.data.dataset.source.data_source.image_transforms.transforms.contrast"
                              v-model="item.contrast"
                            />
                          </div>
                        </template>
                        <template v-if="item._target_ === 'torchvision.transforms.ColorJitter'">
                          <div class="config-row">
                            <HConfigTagSelect
                              class="row-style"
                              label="saturation"
                              tooltip="train.data.dataset.source.data_source.image_transforms.transforms.saturation"
                              v-model="item.saturation"
                            />
                            <HConfigTagSelect
                              class="row-style"
                              label="hue"
                              tooltip="train.data.dataset.source.data_source.image_transforms.transforms.hue"
                              v-model="item.hue"
                            />
                          </div>
                        </template>
                        <template v-if="item._target_ === 'torchvision.transforms.GaussianBlur'">
                          <div class="config-row">
                            <HConfigTagSelect
                              class="row-style"
                              label="kernel_size"
                              tooltip="train.data.dataset.source.data_source.image_transforms.transforms.kernel_size"
                              v-model="item.kernel_size"
                            />
                            <HConfigTagSelect
                              class="row-style"
                              label="sigma"
                              tooltip="train.data.dataset.source.data_source.image_transforms.transforms.sigma"
                              v-model="item.sigma"
                            />
                          </div>
                        </template>
                      </HBlock>
                    </template>
                  </HBlock>

                  <!-- tag_transforms -->
                  <HBlock
                    :h-index="5"
                    label="tag_transforms"
                    showAdd
                    tooltip="train.data.dataset.source.data_source.tag_transformsTip"
                    @onAdd="addTagTransforms(dataset, source)"
                    showEditYaml
                    :config="local_config[dataset].source[source].tag_transforms"
                    @confirm="
                      (value) =>
                        this.$set(this.local_config[dataset].source[source], tag_transforms, value)
                    "
                  >
                    <template v-if="local_config[dataset].source[source].tag_transforms.transforms">
                      <HBlock
                        v-for="(transforms, transforms_index) in local_config[dataset].source[
                          source
                        ].tag_transforms.transforms || []"
                        :key="transforms._target_ + transforms_index"
                        :h-index="6"
                        style="margin-top: 10px"
                        :label="`transforms-${transforms_index}`"
                        :showIcon="
                          local_config[dataset].source[source].tag_transforms.transforms.length > 1
                        "
                        tooltip="train.data.dataset.source.data_source.tag_transformsTip"
                        @onDelete="deleteTagTransforms(dataset, source, transforms_index)"
                      >
                        <div class="config-row">
                          <HConfigSelect
                            class="row-style"
                            label="_target_"
                            :options="tagTransformsConfig"
                            v-model="transforms._target_"
                            tooltip="train.data.dataset.source.data_source.tag_transforms._target_"
                            @onChange="
                              (e) =>
                                handlerChangeTagTransforms(dataset, source, transforms_index, e)
                            "
                          />
                          <template
                            v-if="transforms._target_ === 'hcpdiff.utils.caption_tools.TagDropout'"
                          >
                            <HConfigInputNumber
                              class="row-style"
                              label="p"
                              :min="0"
                              :max="1"
                              :step="0.01"
                              tooltip="train.data.dataset.source.data_source.tag_transforms.transforms.p"
                              v-model="transforms.p"
                            />
                          </template>
                        </div>
                        <HBlock
                          label="word_names"
                          tooltip="train.data.dataset.source.data_source.tag_transforms.transforms.word_names"
                          :h-index="7"
                          v-if="transforms._target_ === 'hcpdiff.utils.caption_tools.TemplateFill'"
                        >
                          <EditWordName
                            :value="transforms.word_names"
                            @confirm="
                              (e) => confirmChangeWordName(dataset, source, transforms_index, e)
                            "
                          />
                        </HBlock>
                      </HBlock>
                    </template>
                  </HBlock>
                </HBlock>
              </HBlock>
            </HBlock>
          </el-carousel-item>
        </el-carousel>
      </template>
    </HBlock>
  </h-collapse>
</template>
<script>
import EditWordName from './editWordName.vue';
import { handleOptions } from '@/utils/index';
import { getTrain } from '@/api/train';
import {
  default_train_data,
  img_transformsConfigKeys,
  tag_transformsConfigKeys,
  bucket__target__options,
  tag_transformsConfigKeysOptions
} from '@/constants/index';
import useSnStore from '@/store/snStore';
export default {
  name: 'TokenizerPtConfig',
  components: {
    EditWordName
  },
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    tabHeight: {
      type: Number,
      default: 1000
    }
  },
  setup() {
    const snStore = useSnStore();
    return { snStore };
  },
  watch: {
    local_config: {
      handler(val) {
        if (val) {
          this.restScrollPosition();
          this.datasetList = Object.keys(val);
          this.$emit('updateData', val);
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      datasetIndex: 0,
      currentIndex: 0,
      bucket__target__options,
      local_config: this.params.data,
      datasetList: [],
      prompt_template_options: []
    };
  },
  computed: {
    getDatasetName({ datasetList }) {
      const length = datasetList.length;
      let datasetName = `dataset${length + 1}`;
      if (datasetList.includes(datasetName)) {
        datasetName = `dataset${length + 2}`;
      }
      return datasetName;
    },
    imgTransformsConfig() {
      return Object.keys(img_transformsConfigKeys).map((key) => {
        return {
          key,
          row: img_transformsConfigKeys[key],
          label: key,
          value: key
        };
      });
    },
    tagTransformsConfig() {
      return handleOptions(tag_transformsConfigKeysOptions);
    }
  },
  provide() {
    return {
      configValue: () => this.local_config[this.datasetList[this.currentIndex]]
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      const result = await getTrain(this.snStore.train_sn).catch((err) => {
        this.$message.error(err);
      });
      if (!result) return;
      const { prompt_template = [] } = result;
      this.prompt_template_options = handleOptions(prompt_template);
    },
    handlerBucketTargetChange(dataset, e) {
      if (e === 'hcpdiff.data.bucket.RatioBucket.from_files') {
        this.$delete(this.local_config[dataset].bucket, 'target_size');
        this.$set(this.local_config[dataset].bucket, 'target_area', {
          _target_: 'builtins.eval',
          _args_: ['512*512']
        });
        this.$set(this.local_config[dataset].bucket, 'num_bucket', 1);
      } else if (e === 'hcpdiff.data.bucket.FixedBucket') {
        this.$delete(this.local_config[dataset].bucket, 'target_area');
        this.$delete(this.local_config[dataset].bucket, 'num_bucket');
        this.$set(this.local_config[dataset].bucket, 'target_size', [512, 512]);
      }
      this.$forceUpdate();
    },
    handlerPreDataset() {
      if (this.datasetList.length <= 0) return;
      this.datasetIndex -= 1;
      this.$refs.dataCarouselRef.prev();
    },
    handlerNextDataset() {
      if (this.datasetList.length <= 0) return;
      this.datasetIndex += 1;
      this.$refs.dataCarouselRef.next();
    },
    dataSourceList(dataset) {
      const data = this.local_config[dataset].source;
      const keys = Object.keys(data);
      return keys.map((key) => {
        return {
          source: key,
          key: Math.random()
        };
      });
    },
    dataSourceName(dataset) {
      const length = this.dataSourceList(dataset).length;
      return `data_source${length + 1}`;
    },
    addDateset() {
      console.log(1, this.local_config, this.datasetList.length);
      if (!this.local_config) {
        this.local_config = {};
      }
      console.log(2, this.local_config, this.datasetList.length);
      this.$set(
        this.local_config,
        this.getDatasetName,
        JSON.parse(JSON.stringify(default_train_data.data.dataset1))
      );
      console.log(3, this.local_config, this.datasetList.length);
      this.$forceUpdate();
    },
    deleteDataset(dataset) {
      this.$delete(this.local_config, dataset);
      const length = Object.keys(this.local_config).length;
      if (length === 0) {
        this.local_config = null;
        this.isOpenDatasetCollapse = false;
      }
      if (this.datasetIndex > length - 1) {
        this.datasetIndex = length - 1;
      }
      this.$forceUpdate();
    },
    handlerChangeImgTransforms(dataset, source, index, key) {
      const newConfig = JSON.parse(JSON.stringify(img_transformsConfigKeys[key]));
      this.$set(
        this.local_config[dataset].source[source].image_transforms.transforms,
        index,
        newConfig
      );
      this.$forceUpdate();
    },
    addTagTransforms(dataset, source) {
      if (!this.local_config[dataset].source[source].tag_transforms.transforms) {
        this.$set(this.local_config[dataset].source[source].tag_transforms, 'transforms', []);
      }
      this.local_config[dataset].source[source].tag_transforms.transforms.push(
        JSON.parse(
          JSON.stringify(tag_transformsConfigKeys['hcpdiff.utils.caption_tools.TagShuffle'])
        )
      );
      this.$forceUpdate();
    },
    deleteTagTransforms(dataset, source, index) {
      this.local_config[dataset].source[source].tag_transforms.transforms.splice(index, 1);
      if (this.local_config[dataset].source[source].tag_transforms.transforms.length === 0) {
        this.$set(this.local_config[dataset].source[source].tag_transforms, 'transforms', null);
      }
      this.$forceUpdate();
    },
    addImgTransforms(dataset, source) {
      if (!this.local_config[dataset].source[source].image_transforms.transforms) {
        this.$set(this.local_config[dataset].source[source].image_transforms, 'transforms', []);
      }
      this.local_config[dataset].source[source].image_transforms.transforms.push(
        JSON.parse(JSON.stringify(img_transformsConfigKeys['torchvision.transforms.Normalize']))
      );
      this.$forceUpdate();
    },
    deleteImgTransforms(dataset, source, index) {
      this.local_config[dataset].source[source].image_transforms.transforms.splice(index, 1);
      if (this.local_config[dataset].source[source].image_transforms.transforms.length === 0) {
        this.$set(this.local_config[dataset].source[source].image_transforms, 'transforms', null);
      }
      this.$forceUpdate();
    },
    addDataSourceData_source(dataset) {
      if (!this.local_config[dataset].source) {
        this.$set(this.local_config[dataset], 'source', {});
      }
      this.$set(
        this.local_config[dataset].source,
        this.dataSourceName(dataset),
        JSON.parse(JSON.stringify(default_train_data.data.dataset1.source.data_source1))
      );
      this.$forceUpdate();
    },
    deleteDataSourceData_source(dataset, source) {
      this.$delete(this.local_config[dataset].source, source);
      this.$forceUpdate();
    },
    saveScrollPosition(index) {
      this.currentIndex = index;
      const carouselEl = this.$refs[`dataset-${index}`][0].$el;
      const wrapperEl = carouselEl.parentNode;
      this.scrollPosition = wrapperEl.scrollTop;
    },
    restScrollPosition() {
      this.$nextTick(() => {
        if (!this.$refs[`dataset-${this.currentIndex}`]) return;
        const carouselEl = this.$refs[`dataset-${this.currentIndex}`][0].$el;
        const wrapperEl = carouselEl.parentNode;
        wrapperEl.scrollTop = this.scrollPosition;
      });
    },
    handleImgTransformsChange(dataset, source, val) {
      if (val) {
        if (!this.local_config[dataset].source[source].image_transforms.transforms) {
          this.local_config[dataset].source[source].image_transforms.transforms = [
            JSON.parse(JSON.stringify(img_transformsConfigKeys['torchvision.transforms.Normalize']))
          ];
        }
      } else {
        this.local_config[dataset].source[source].image_transforms.transforms = null;
      }
    },
    handlerChangeTagTransforms(dataset, source, index, key) {
      switch (key) {
        case 'hcpdiff.utils.caption_tools.TagShuffle':
          this.$delete(
            this.local_config[dataset].source[source].tag_transforms.transforms[index],
            'p'
          );
          this.$delete(
            this.local_config[dataset].source[source].tag_transforms.transforms[index],
            'word_names'
          );
          break;
        case 'hcpdiff.utils.caption_tools.TagDropout':
          this.$set(
            this.local_config[dataset].source[source].tag_transforms.transforms[index],
            'p',
            0.1
          );
          this.$delete(
            this.local_config[dataset].source[source].tag_transforms.transforms[index],
            'word_names'
          );
          break;
        case 'hcpdiff.utils.caption_tools.TemplateFill':
          this.$set(
            this.local_config[dataset].source[source].tag_transforms.transforms[index],
            'word_names',
            {}
          );
          this.$delete(
            this.local_config[dataset].source[source].tag_transforms.transforms[index],
            'p'
          );
          break;
      }
      this.$forceUpdate();
    },
    addImage_transformsTransforms(dataset, source) {
      this.local_config[dataset].source[source].image_transforms.transforms.push(
        JSON.parse(
          JSON.stringify(
            default_train_data.data[dataset].source.data_source1.image_transforms.transforms[0]
          )
        )
      );
    },
    deleteImage_transformsTransforms(dataset, source, index) {
      this.local_config[dataset].source[source].image_transforms.transforms.splice(index, 1);
    },
    confirmChangeWordName(dataset, source, index, value) {
      this.$set(
        this.local_config[dataset].source[source].tag_transforms.transforms[index],
        'word_names',
        value
      );
      this.$forceUpdate();
    },
    confirmYamlEdit(value) {
      this.$set(this.local_config, this.datasetList[this.currentIndex], value);
      this.$forceUpdate();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-carousel__item {
  overflow-y: auto;
}
.transforms-carousel {
  overflow-x: initial;
  .el-carousel__arrow {
    top: -16px;
    background: transparent;
    color: #409eff;
    cursor: pointer;
    & > i {
      font-size: 16px;
    }
  }
  .el-carousel__arrow--left {
    left: 156px;
  }
  .el-carousel__arrow--right {
    right: auto;
    left: 194px;
  }
}
</style>
