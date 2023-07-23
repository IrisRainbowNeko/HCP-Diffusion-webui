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
    @onSwitch="handleSwitchMergeConfig"
    showEditYaml
    :config="configStore.generate.merge"
    @confirm="onConfirm"
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
        <template v-for="(item, groupKey) in configStore.generate.merge">
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
              :config="configStore.generate.merge[groupKey]"
              @confirm="
                (value) => {
                  config[groupKey] = value;
                }
              "
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
                  @confirm="
                    (value) => {
                      item['lora'] = value;
                    }
                  "
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
                        :options="merge_group_lora_path"
                        @refresh="handleRefresh('merge_group_lora_path')"
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
                  @confirm="
                    (value) => {
                      item['part'] = value;
                    }
                  "
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
                        :options="merge_group_part_path"
                        v-model="part_item.path"
                        @refresh="handleRefresh('merge_group_part_path')"
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
                  @confirm="
                    (value) => {
                      item['plugin'] = value;
                    }
                  "
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
                          :options="merge_group_plugin_controlnet1_path"
                          v-model="plugin_item.controlnet1.path"
                          @refresh="handleRefresh('merge_group_plugin_controlnet1_path')"
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
  default_data,
  default_group_plugin,
  group_plugin_options,
  mask_options
} from '@/constants/index';
import useConfigStore from '@/store/configStore';
import { cloneDeep, assign } from 'lodash-es';
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
    },
    merge_group_lora_path: {
      type: Array,
      default: () => []
    },
    merge_group_part_path: {
      type: Array,
      default: () => []
    },
    merge_group_plugin_controlnet1_path: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      group_plugin_options,
      mask_options,
      cacheConfig: cloneDeep(default_data.merge),
      isOpenMergeConfig: false,

      currentIndex: 0,
      carouselHeight: '810px'
    };
  },
  setup() {
    const configStore = useConfigStore();
    return { configStore };
  },
  computed: {
    groupNameList() {
      return Object.keys(this.configStore.generate.merge || {});
    },
    currentGroupName({ groupNameList }) {
      return groupNameList[this.currentIndex];
    }
  },
  watch: {
    value: {
      handler: function (val) {
        // marge配置项为空时，自动添加一个配置项
        if (val) {
          // 必须修改上层才会触发响应
          this.configStore.generate = {
            ...this.configStore.generate,
            merge: cloneDeep(this.cacheConfig || default_data.merge)
          };
        } else {
          // 备份
          this.cacheConfig = cloneDeep(this.configStore.generate.merge);
          // 必须修改上层才会触发响应
          this.configStore.generate = {
            ...this.configStore.generate,
            merge: null
          };
        }

        this.isOpenMergeConfig = val;
      },
      immediate: true
    },
    // TODO：初始化逻辑优化
    isOpenNewComponentsConfig: {
      handler: function (value) {
        console.log(value);
      }
    }
  },
  methods: {
    onConfirm(value) {
      assign(this.configStore.generate.merge, value);
    },
    onCarouselItemConfirm(groupKey, value) {
      assign(this.configStore.generate.merge[groupKey], value);
    },
    onBlockConfirm(groupKey, prop, value) {
      assign(this.configStore.generate.merge[groupKey][prop], value);
    },
    handleChangeType(type, groupKey) {
      const config = cloneDeep(this.configStore.generate.merge);
      if (type === 'unet') {
        config[groupKey].plugin = [default_group_plugin];
      } else {
        delete config[groupKey].plugin;
      }
      this.configStore.generate = { ...this.configStore.generate, merge: config };
    },

    addMergeGroupPropConfig(groupKey, prop) {
      const config = cloneDeep(this.configStore.generate.merge);
      if (!config[groupKey][prop]) {
        config[groupKey][prop] = [];
      }
      let obj = {};
      if (prop === 'plugin') {
        obj = default_group_plugin;
      } else {
        obj = default_data.merge.group1[prop][0];
      }
      config[groupKey][prop].push(cloneDeep(obj));
      this.configStore.generate = { ...this.configStore.generate, merge: config };
    },
    deleteMergeGroupPropConfig(groupKey, prop, index) {
      const config = cloneDeep(this.configStore.generate.merge);
      config[groupKey][prop].splice(index, 1);
      if (config[groupKey][prop].length === 0) {
        config[groupKey][prop] = null;
      }
      this.configStore.generate = { ...this.configStore.generate, merge: config };
    },
    addMergeGroupConfig() {
      let config = cloneDeep(this.configStore.generate.merge);
      if (!config) {
        config = {};
      }
      const length = Object.keys(config || {}).length;
      config[`group${length + 1}`] = cloneDeep(default_data.merge.group1);
      this.configStore.generate = { ...this.configStore.generate, merge: config };
    },
    deleteMergeGroupConfig(groupKey) {
      let config = cloneDeep(this.configStore.generate.merge);
      delete config[groupKey];
      if (Object.keys(config || {}).length === 0) {
        this.$emit('open', false);
        config = null;
      }
      this.configStore.generate = { ...this.configStore.generate, merge: config };
    },
    preMergeGroupConfig() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
        this.$refs.carouselRef.prev();
      }
    },
    nextMergeGroupConfig() {
      if (this.currentIndex < Object.keys(this.configStore.generate.merge || {}).length - 1) {
        this.currentIndex += 1;
        this.$refs.carouselRef.next();
      }
    },
    handleChangeMask(e, groupKey, index) {
      const config = cloneDeep(this.configStore.generate.merge);
      config[groupKey].lora[index].mask = e === '-1' ? null : e.split(',').map(Number);
      this.configStore.generate = { ...this.configStore.generate, merge: config };
    },
    handleSwitchMergeConfig(val) {
      this.$emit('open', val);
    },
    handleRefresh(field) {
      this.$emit('refresh', field);
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
