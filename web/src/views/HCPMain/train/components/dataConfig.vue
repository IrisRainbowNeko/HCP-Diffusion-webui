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
    showEditYaml
    :config="config.data"
    @add="addDateset"
    @pre="handlerPreDataset"
    @next="handlerNextDataset"
    @confirm="(value) => (config.data = value)"
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
              :config="config.data[dataset]"
              @confirm="(value) => $set(config.data, dataset, value)"
            >
              <div class="config-row">
                <HConfigInput
                  class="row-style"
                  label="_target_"
                  disabled
                  tooltip="train.data.dataset._target_"
                  v-model="config.data[dataset]._target_"
                />
                <div class="config-row" style="flex: 1">
                  <el-checkbox v-model="config.data[dataset].cache_latents">
                    cache_latents
                  </el-checkbox>
                  <el-checkbox v-model="config.data[dataset].att_mask_encode">
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
                  v-model="config.data[dataset].batch_size"
                />
                <HConfigInputNumber
                  class="row-style"
                  label="loss_weight"
                  :min="0"
                  :max="10"
                  :step="0.01"
                  tooltip="train.data.dataset.loss_weight"
                  v-model="config.data[dataset].loss_weight"
                />
              </div>
              <!-- bucket -->
              <HBlock
                label="bucket"
                tooltip="train.data.dataset.bucketTip"
                :h-index="3"
                showEditYaml
                :config="config.data[dataset].bucket"
                @confirm="(value) => $set(config.data[dataset], 'bucket', value)"
              >
                <div class="config-row">
                  <HConfigSelect
                    class="row-style"
                    label="_target_"
                    tooltip="train.data.dataset.bucket._target_"
                    :options="bucket__target__options"
                    v-model="config.data[dataset].bucket._target_"
                    @onChange="(e) => handlerBucketTargetChange(config, dataset, e)"
                  />
                  <template
                    v-if="
                      config.data[dataset].bucket._target_ ===
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
                      v-model="config.data[dataset].bucket.num_bucket"
                    />
                  </template>
                  <div
                    class="config-row"
                    v-if="
                      config.data[dataset].bucket._target_ === 'hcpdiff.data.bucket.FixedBucket' &&
                      config.data[dataset].bucket.target_size
                    "
                  >
                    <HConfigInputNumber
                      label="target_size"
                      class="row-style"
                      tooltip="train.data.dataset.bucket.target_size"
                      v-model="config.data[dataset].bucket.target_size[0]"
                    />
                    <HConfigInputNumber v-model="config.data[dataset].bucket.target_size[1]" />
                  </div>
                </div>
                <HBlock
                  :h-index="4"
                  label="target_area"
                  tooltip="train.data.dataset.bucket.target_areaTip"
                  v-if="
                    config.data[dataset].bucket._target_ ===
                      'hcpdiff.data.bucket.RatioBucket.from_files' &&
                    config.data[dataset].bucket.target_area
                  "
                >
                  <div class="config-row">
                    <HConfigInput
                      class="row-style"
                      label="_target_"
                      tooltip="train.data.dataset.bucket.target_area._target_"
                      v-model="config.data[dataset].bucket.target_area._target_"
                    />
                    <HConfigInputSum
                      class="row-style"
                      label="_args_"
                      tooltip="train.data.dataset.bucket.target_area._args_"
                      v-model="config.data[dataset].bucket.target_area._args_"
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
                :config="config.data[dataset].source"
                @confirm="(value) => $set(config.data[dataset], 'source', value)"
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
                  :config="config.data[dataset].source[source]"
                  @confirm="(value) => $set(config.data[dataset].source, source, value)"
                >
                  <div class="config-row">
                    <HConfigInput
                      class="row-style"
                      label="img_root"
                      tooltip="train.data.dataset.source.data_source.img_root"
                      v-model="config.data[dataset].source[source].img_root"
                    />
                    <HConfigInput
                      class="row-style"
                      label="att_mask"
                      tooltip="train.data.dataset.source.data_source.att_mask"
                      v-model="config.data[dataset].source[source].att_mask"
                    />
                  </div>
                  <div class="config-row">
                    <HConfigSelect
                      class="row-style"
                      label="prompt_template"
                      :options="prompt_template_options"
                      tooltip="train.data.dataset.source.data_source.prompt_template"
                      v-model="config.data[dataset].source[source].prompt_template"
                    />
                    <HConfigInput
                      class="row-style"
                      label="caption_file"
                      tooltip="train.data.dataset.source.data_source.caption_file"
                      v-model="config.data[dataset].source[source].caption_file"
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
                    showEditYaml
                    :config="config.data[dataset].source[source].image_transforms"
                    @confirm="
                      (value) =>
                        $set(config.data[dataset].source[source], 'image_transforms', value)
                    "
                  >
                    <template
                      v-if="config.data[dataset].source[source].image_transforms.transforms"
                    >
                      <HBlock
                        style="margin-top: 10px"
                        v-for="(item, index) in config.data[dataset].source[source].image_transforms
                          .transforms || []"
                        :key="item._target_ + index"
                        :h-index="6"
                        :label="`transforms-${index}`"
                        :showIcon="
                          config.data[dataset].source[source].image_transforms.transforms.length > 1
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
                            @onChange="
                              (e) => handlerChangeImgTransforms(config, dataset, source, index, e)
                            "
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
                    :config="config.data[dataset].source[source].tag_transforms"
                    @confirm="
                      (value) => $set(config.data[dataset].source[source], 'tag_transforms', value)
                    "
                  >
                    <template v-if="config.data[dataset].source[source].tag_transforms.transforms">
                      <HBlock
                        v-for="(transforms, transforms_index) in config.data[dataset].source[source]
                          .tag_transforms.transforms || []"
                        :key="transforms._target_ + transforms_index"
                        :h-index="6"
                        style="margin-top: 10px"
                        :label="`transforms-${transforms_index}`"
                        :showIcon="
                          config.data[dataset].source[source].tag_transforms.transforms.length > 1
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
                                handlerChangeTagTransforms(
                                  config,
                                  dataset,
                                  source,
                                  transforms_index,
                                  e
                                )
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
import { storeToRefs } from 'pinia';
import { isEmpty, cloneDeep, filter, map, max, forEach, isEqual } from 'lodash-es';
import {
  default_train_data,
  default_image_transforms,
  default_tag_transforms,
  img_transformsConfigKeys,
  tag_transformsConfigKeys,
  bucket__target__options,
  tag_transformsConfigKeysOptions
} from '@/constants/index';
import useTrainStore from '@/store/trainStore';
import useSnStore from '@/store/snStore';
const default_target_area = default_train_data.data.dataset1.bucket.target_area;
const default_target_size = default_train_data.data.dataset1.bucket.target_size;
const dataset_key = 'dataset';
const data_source_key = 'data_source';
const datasetRegExp = new RegExp(`${dataset_key}\\d+`);
const dataSourceRegExp = new RegExp(`${data_source_key}\\d+`);
export default {
  name: 'TokenizerPtConfig',
  components: {
    EditWordName
  },
  props: {
    tabHeight: {
      type: Number,
      default: 1000
    }
  },
  setup() {
    const snStore = useSnStore();
    const trainStore = useTrainStore();
    const { train } = storeToRefs(trainStore);
    return { snStore, trainStore, config: train };
  },
  watch: {
    'config.data': {
      handler(val) {
        if (val) {
          this.restScrollPosition();
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
      prompt_template_options: []
    };
  },
  computed: {
    datasetList() {
      return Object.keys(this.config.data);
    },
    getDatasetName() {
      const controlnetKeys = filter(this.datasetList, (key) => datasetRegExp.test(key));
      const nums = map(controlnetKeys, (key) => Number(key.replace(dataset_key, '')));
      const num = nums.length === 0 ? 1 : max(nums) + 1;
      return `${dataset_key}${num}`;
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
  methods: {
    initDefaultData(newInfo) {
      const { prompt_template = [] } = newInfo;
      this.prompt_template_options = handleOptions(prompt_template);
      this.handleInitData(newInfo);
    },
    handleInitData(newInfo) {
      if (isEmpty(newInfo.data)) return;
      forEach(newInfo.data, (datasetValue, datasetKey) => {
        // bucket init
        this.handlerBucketTargetChange(newInfo, datasetKey, datasetValue.bucket._target_);
        forEach(datasetValue.source, (dataSourceValue, dataSourceKey) => {
          // image transforms init
          const imageTransforms = dataSourceValue.image_transforms;
          if (
            !imageTransforms ||
            !imageTransforms.transforms ||
            imageTransforms.transforms.length === 0
          ) {
            this.$set(dataSourceValue, 'image_transforms', default_image_transforms);
          }
          // transforms of image transforms init
          const transformsOfImage = imageTransforms.transforms;
          forEach(transformsOfImage, (transformValue, transformIndex) => {
            this.handlerChangeImgTransforms(
              newInfo,
              datasetKey,
              dataSourceKey,
              transformIndex,
              transformValue._target_
            );
          });
          // tag transforms init
          const tagTransforms = dataSourceValue.tag_transforms;
          if (
            !tagTransforms ||
            !tagTransforms.transforms ||
            tagTransforms.transforms.length === 0
          ) {
            this.$set(dataSourceValue, 'tagTransforms', default_tag_transforms);
          }
          // transforms of tag transforms init
          const transformsOfTag = dataSourceValue.tag_transforms.transforms;
          forEach(transformsOfTag, (transformValue, transformIndex) => {
            this.handlerChangeTagTransforms(
              newInfo,
              datasetKey,
              dataSourceKey,
              transformIndex,
              transformValue._target_
            );
          });
        });
      });
    },

    handlerBucketTargetChange(config, dataset, e) {
      const bucket = config.data[dataset].bucket;
      if (e === 'hcpdiff.data.bucket.RatioBucket.from_files') {
        if (bucket.target_size) this.$delete(bucket, 'target_size');
        if (!bucket.target_area) this.$set(bucket, 'target_area', cloneDeep(default_target_area));
        if (!bucket.num_bucket) this.$set(bucket, 'num_bucket', 1);
      } else if (e === 'hcpdiff.data.bucket.FixedBucket') {
        if (bucket.target_area) this.$delete(bucket, 'target_area');
        if (bucket.num_bucket) this.$delete(bucket, 'num_bucket');
        if (!bucket.target_size) this.$set(bucket, 'target_size', cloneDeep(default_target_size));
      }
    },

    handlerChangeImgTransforms(config, dataset, source, index, key) {
      const transforms = config.data[dataset].source[source].image_transforms.transforms;
      const transform = transforms[index];
      if (transform._target_) {
        const newConfig = cloneDeep(img_transformsConfigKeys[key]);
        if (newConfig) {
          const isKeysEqual = isEqual(Object.keys(newConfig), Object.keys(transform));
          if (!isKeysEqual) this.$set(transforms, index, newConfig);
        }
      }
    },

    handlerChangeTagTransforms(config, dataset, source, index, key) {
      const transform = config.data[dataset].source[source].tag_transforms.transforms[index];
      if (key) {
        switch (key) {
          case 'hcpdiff.utils.caption_tools.TagShuffle':
            if (transform.p) this.$delete(transform, 'p');
            if (transform.word_names) this.$delete(transform, 'word_names');
            break;
          case 'hcpdiff.utils.caption_tools.TagDropout':
            if (!transform.p) this.$set(transform, 'p', 0.1);
            if (transform.word_names) this.$delete(transform, 'word_names');
            break;
          case 'hcpdiff.utils.caption_tools.TemplateFill':
            if (!transform.word_names) this.$set(transform, 'word_names', {});
            if (transform.p) this.$delete(transform, 'p');
            break;
        }
      }
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
      const data = this.config.data[dataset].source;
      const keys = Object.keys(data);
      return keys.map((key) => {
        return {
          source: key,
          key: Math.random()
        };
      });
    },
    dataSourceName(dataset) {
      const controlnetKeys = filter(Object.keys(this.config.data[dataset].source), (key) =>
        dataSourceRegExp.test(key)
      );
      const nums = map(controlnetKeys, (key) => Number(key.replace(data_source_key, '')));
      const num = nums.length === 0 ? 1 : max(nums) + 1;
      return `${data_source_key}${num}`;
    },
    addDateset() {
      console.log(1, this.config.data, this.datasetList.length);
      if (!this.config.data) {
        this.config.data = {};
      }
      console.log(2, this.config.data, this.datasetList.length);
      this.$set(this.config.data, this.getDatasetName, cloneDeep(default_train_data.data.dataset1));
      console.log(3, this.config.data, this.datasetList.length);
    },
    deleteDataset(dataset) {
      this.$delete(this.config.data, dataset);
      const length = Object.keys(this.config.data).length;
      if (length === 0) {
        this.config.data = null;
      }
      if (this.datasetIndex > length - 1) {
        this.datasetIndex = length - 1;
      }
    },
    addTagTransforms(dataset, source) {
      if (!this.config.data[dataset].source[source].tag_transforms.transforms) {
        this.$set(this.config.data[dataset].source[source].tag_transforms, 'transforms', []);
      }
      this.config.data[dataset].source[source].tag_transforms.transforms.push(
        cloneDeep(tag_transformsConfigKeys['hcpdiff.utils.caption_tools.TagShuffle'])
      );
    },
    deleteTagTransforms(dataset, source, index) {
      this.config.data[dataset].source[source].tag_transforms.transforms.splice(index, 1);
      if (this.config.data[dataset].source[source].tag_transforms.transforms.length === 0) {
        this.$set(this.config.data[dataset].source[source].tag_transforms, 'transforms', null);
      }
    },
    addImgTransforms(dataset, source) {
      if (!this.config.data[dataset].source[source].image_transforms.transforms) {
        this.$set(this.config.data[dataset].source[source].image_transforms, 'transforms', []);
      }
      this.config.data[dataset].source[source].image_transforms.transforms.push(
        cloneDeep(img_transformsConfigKeys['torchvision.transforms.Normalize'])
      );
    },
    deleteImgTransforms(dataset, source, index) {
      this.config.data[dataset].source[source].image_transforms.transforms.splice(index, 1);
      if (this.config.data[dataset].source[source].image_transforms.transforms.length === 0) {
        this.$set(this.config.data[dataset].source[source].image_transforms, 'transforms', null);
      }
    },
    addDataSourceData_source(dataset) {
      if (!this.config.data[dataset].source) {
        this.$set(this.config.data[dataset], 'source', {});
      }
      this.$set(
        this.config.data[dataset].source,
        this.dataSourceName(dataset),
        cloneDeep(default_train_data.data.dataset1.source.data_source1)
      );
    },
    deleteDataSourceData_source(dataset, source) {
      this.$delete(this.config.data[dataset].source, source);
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
    addImage_transformsTransforms(dataset, source) {
      this.config.data[dataset].source[source].image_transforms.transforms.push(
        cloneDeep(
          default_train_data.data[dataset].source.data_source1.image_transforms.transforms[0]
        )
      );
    },
    deleteImage_transformsTransforms(dataset, source, index) {
      this.config.data[dataset].source[source].image_transforms.transforms.splice(index, 1);
    },
    confirmChangeWordName(dataset, source, index, value) {
      this.$set(
        this.config.data[dataset].source[source].tag_transforms.transforms[index],
        'word_names',
        value
      );
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
