<template>
  <h-collapse
    title="Merge Config"
    v-model="isOpenMergeConfig"
    showSwitch
    :showAdd="isOpenMergeConfig"
    :showPre="isOpenMergeConfig"
    :showNext="isOpenMergeConfig"
    :nextDisabled="currentIndex === groupNameList.length - 1"
    :preDisabled="currentIndex === 0"
    @add="addMergeGroupConfig"
    @pre="preMergeGroupConfig"
    @next="nextMergeGroupConfig"
    @onSwitch="(e) => $emit('open', e)"
    showEditYaml
    :config="config.merge"
    @confirm="(value) => $set(config, 'merge', value)"
  >
    <!-- <HBlock class="merge-config-block"> -->
    <div class="config-row config-row-special merge-config-block">
      <!-- group1 -->
      <el-carousel
        ref="carouselRef"
        :autoplay="false"
        :initial-index="currentIndex"
        arrow="never"
        :height="carouselHeight"
      >
        <template v-for="(item, groupKey) in config.merge">
          <el-carousel-item v-if="item.type" :key="groupKey">
            <HBlock
              tooltip="generate.merge.groupTip"
              :h-index="2"
              :ref="`mergeWrapperRef`"
              :label="groupKey"
              style="width: 100%"
              showIcon
              @onDelete="deleteMergeGroupConfig(groupKey)"
              showEditYaml
              :config="config.merge[groupKey]"
              @confirm="(value) => $set(item, groupKey, value)"
            >
              <template>
                <div class="config-row">
                  <HConfigSelect
                    label="type"
                    v-model="item.type"
                    tooltip="generate.merge.group.type"
                    :options="group_plugin_options"
                    @onChange="(e) => handleChangeType(e, groupKey)"
                  />
                  <HConfigInputNumber
                    label="base_model_alpha"
                    tooltip="generate.merge.group.base_model_alpha"
                    :min="-100000"
                    :max="100000"
                    v-model="item.base_model_alpha"
                  />
                </div>
                <!-- lora -->
                <HBlock
                  label="lora"
                  tooltip="generate.merge.group.loraTip"
                  :h-index="3"
                  showAdd
                  @onAdd="addMergeGroupPropConfig(groupKey, 'lora')"
                  showEditYaml
                  :config="item.lora"
                  @confirm="(value) => $set(item, 'lora', value)"
                >
                  <div
                    class="block-style-item"
                    v-for="(lora_item, index) in item.lora || []"
                    :key="`${index}-${Math.random()}`"
                  >
                    <div class="config-row">
                      <HConfigSelect
                        required
                        label="path"
                        showRefresh
                        v-model="lora_item.path"
                        tooltip="generate.merge.group.lora.path"
                        :options="generateStore.merge_group_lora_path_options"
                        @refresh="generateStore.refreshTemplate('merge_group_lora_path')"
                      />
                      <HConfigInputNumber
                        label="alpha"
                        :min="-100000"
                        :max="100000"
                        :controls="false"
                        tooltip="generate.merge.group.lora.alpha"
                        v-model="lora_item.alpha"
                      />
                    </div>
                    <div class="config-row">
                      <HConfigInput
                        label="layers"
                        tooltip="generate.merge.group.lora.layers"
                        v-model="lora_item.layers"
                      />
                    </div>
                    <div class="config-row">
                      <HConfigSelect
                        label="mask"
                        tooltip="generate.merge.group.lora.mask"
                        :options="mask_options"
                        :value="lora_item.mask"
                        :defaultValue="(lora_item.mask || '-1').toString()"
                        @onChange="(e) => handleChangeMask(e, groupKey, index)"
                      />
                    </div>
                    <i
                      class="icon el-icon-delete"
                      style="color: red"
                      @click="deleteMergeGroupPropConfig(groupKey, 'lora', index)"
                    ></i>
                  </div>
                </HBlock>

                <!-- part -->
                <HBlock
                  label="part"
                  tooltip="generate.merge.group.partTip"
                  :h-index="3"
                  showAdd
                  @onAdd="addMergeGroupPropConfig(groupKey, 'part')"
                  showEditYaml
                  :config="item.part"
                  @confirm="(value) => $set(item, 'part', value)"
                >
                  <div
                    class="block-style-item"
                    v-for="(part_item, index) in item.part || []"
                    :key="`${index}-${Math.random()}`"
                  >
                    <div class="config-row">
                      <HConfigSelect
                        required
                        label="path"
                        tooltip="generate.merge.group.part.path"
                        showRefresh
                        :options="generateStore.merge_group_part_path_options"
                        v-model="part_item.path"
                        @refresh="generateStore.refreshTemplate('merge_group_part_path')"
                      />
                      <HConfigInputNumber
                        label="alpha"
                        :min="-100000"
                        :max="100000"
                        tooltip="generate.merge.group.part.alpha"
                        v-model="part_item.alpha"
                      />
                    </div>
                    <i
                      style="color: red"
                      class="icon el-icon-delete"
                      @click="deleteMergeGroupPropConfig(groupKey, 'part', index)"
                    ></i>
                  </div>
                </HBlock>

                <!-- plugin -->
                <HBlock
                  label="plugin"
                  tooltip="generate.merge.group.pluginTip"
                  :h-index="3"
                  showAdd
                  @onAdd="addMergeGroupPropConfig(groupKey, 'plugin')"
                  showEditYaml
                  :config="item.plugin"
                  @confirm="(value) => $set(item, 'plugin', value)"
                >
                  <template v-if="item.plugin">
                    <div
                      class="block-style-item"
                      v-for="(plugin_item, index) in item.plugin"
                      :key="`${index}-${Math.random()}`"
                    >
                      <div class="config-row" v-if="plugin_item.controlnet1">
                        <HConfigSelect
                          required
                          label="path"
                          showRefresh
                          tooltip="generate.merge.group.plugin.controlnet.path"
                          :options="generateStore.merge_group_plugin_controlnet1_path_options"
                          v-model="plugin_item.controlnet1.path"
                          @refresh="
                            generateStore.refreshTemplate('merge_group_plugin_controlnet1_path')
                          "
                        />
                        <HConfigInput
                          label="layers"
                          tooltip="generate.merge.group.plugin.controlnet.layers"
                          v-model="plugin_item.controlnet1.layers"
                        />
                      </div>
                      <i
                        style="color: red"
                        class="icon el-icon-delete"
                        @click="deleteMergeGroupPropConfig(groupKey, 'plugin', index)"
                      ></i>
                    </div>
                  </template>
                </HBlock>
              </template>
            </HBlock>
          </el-carousel-item>
        </template>
      </el-carousel>
    </div>
    <!-- </HBlock> -->
  </h-collapse>
</template>
<script>
import {
  default_generate_data,
  default_group_plugin,
  group_plugin_options,
  mask_options
} from '@/constants/index';
import { storeToRefs } from 'pinia';
import useGenerateStore from '@/store/generateStore';
import { cloneDeep, isNil, max } from 'lodash-es';
const group_key = 'group';
const groupRegExp = new RegExp(`${group_key}\\d+`);
export default {
  name: 'MergeConfig',
  model: {
    prop: 'value',
    event: 'open'
  },
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      group_plugin_options,
      mask_options,
      cacheConfig: cloneDeep(default_generate_data.merge),
      isOpenMergeConfig: false,

      currentIndex: 0,
      carouselHeight: '810px'
    };
  },
  setup() {
    const generateStore = useGenerateStore();
    const { generate } = storeToRefs(generateStore);
    return { generateStore, config: generate };
  },
  computed: {
    groupNameList() {
      return Object.keys(this.config.merge || {});
    },
    currentGroupName({ groupNameList }) {
      return groupNameList[this.currentIndex];
    }
  },
  watch: {
    value(val) {
      // marge配置项为空时，自动添加一个配置项
      if (val) {
        this.$set(this.config, 'merge', this.cacheConfig);
      } else {
        // 备份
        this.cacheConfig = cloneDeep(this.config.merge || default_generate_data.merge);
        this.$set(this.config, 'merge', null);
      }

      this.isOpenMergeConfig = val;
    },
    'config.merge': {
      handler() {
        this.handleMerge(this.config);
      }
    }
  },
  methods: {
    initDefaultData(newInfo) {
      this.handleMerge(newInfo);
    },
    handleMerge(info) {
      const merge = info.merge;
      if (merge && Object.keys(merge).length === 0) info.merge = null;
      if (info.merge) {
        Object.values(merge).forEach((group) => {
          // 判断plugin是否为空数组
          if (group && group.plugin && !group.plugin.length) {
            this.$set(group, 'plugin', null);
          }
        });
      }
    },
    handleChangeType(type, groupKey) {
      const group = this.config.merge[groupKey];
      if (type === 'unet') {
        this.$set(group, 'plugin', [default_group_plugin]);
      } else {
        this.$set(group, 'plugin', null);
      }
    },

    addMergeGroupPropConfig(groupKey, prop) {
      const group = this.config.merge[groupKey];
      if (!group[prop]) {
        group[prop] = [];
      }
      let obj = [];
      if (prop === 'plugin') {
        obj = cloneDeep(default_group_plugin);
      } else {
        obj = cloneDeep(default_generate_data.merge.group1[prop][0]);
      }
      group[prop].push(cloneDeep(obj));
      this.$set(group, prop, group[prop]);
    },
    deleteMergeGroupPropConfig(groupKey, prop, index) {
      this.config.merge[groupKey][prop].splice(index, 1);
      if (this.config.merge[groupKey][prop].length === 0) {
        this.$set(this.config.merge[groupKey], prop, null);
      }
    },

    addMergeGroupConfig() {
      const merge = this.config.merge;
      if (isNil(merge)) {
        this.$set(this.config, 'merge', {});
      }
      const controlnetKeys = Object.keys(merge || {}).filter((key) => groupRegExp.test(key));
      const nums = controlnetKeys.map((key) => Number(key.replace(group_key, '')));
      const num = nums.length === 0 ? 1 : max(nums) + 1;
      this.$set(merge, `${group_key}${num}`, cloneDeep(default_generate_data.merge.group1));
    },
    deleteMergeGroupConfig(groupKey) {
      const merge = this.config.merge;
      this.$delete(merge, groupKey);
      if (Object.keys(merge || {}).length === 0) {
        this.$emit('open', false);
      }
    },

    preMergeGroupConfig() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
        this.$refs.carouselRef.prev();
      }
    },
    nextMergeGroupConfig() {
      if (this.currentIndex < Object.keys(this.config.merge || {}).length - 1) {
        this.currentIndex += 1;
        this.$refs.carouselRef.next();
      }
    },

    handleChangeMask(e, groupKey, index) {
      const lora = this.config.merge[groupKey].lora[index];
      if (e === '-1') {
        this.$delete(lora, 'mask');
      } else {
        this.$set(lora, 'mask', e.split(',').map(Number));
      }
    }
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>
<style lang="scss">
// 900px - 1200px
.merge-config-block {
  flex-direction: column;
  .el-carousel {
    width: 100%;
    min-height: 200px;
    .el-carousel__item {
      height: auto;
      overflow: hidden;
    }
  }
}
.add-group {
  margin-top: -20px;
}
</style>
