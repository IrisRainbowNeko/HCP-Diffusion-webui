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
    :config="config"
    @confirm="
      (value) => {
        this.config = JSON.parse(JSON.stringify(value));
      }
    "
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
        <el-carousel-item v-for="(item, groupKey) in config" :key="groupKey">
          <HBlock
            tooltip="generate.merge.groupTip"
            :h-index="2"
            :ref="`mergeWrapperRef`"
            :label="groupKey"
            style="width: 100%"
            showIcon
            @onDelete="deleteMergeGroupConfig(groupKey)"
            showEditYaml
            :config="config[groupKey]"
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
                @onAdd="addMergeGroupLoraConfig(groupKey)"
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
                    @click="deleteMergeGroupLoraConfig(groupKey, index)"
                  ></i>
                </div>
              </HBlock>

              <!-- part -->
              <HBlock
                label="part"
                tooltip="generate.merge.group.partTip"
                :h-index="3"
                showAdd
                @onAdd="addMergeGroupPartConfig(groupKey)"
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
                    <HConfigInput
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
                    @click="deleteMergeGroupPartConfig(groupKey, index)"
                  ></i>
                </div>
              </HBlock>

              <!-- plugin -->
              <HBlock
                label="plugin"
                tooltip="generate.merge.group.pluginTip"
                :h-index="3"
                showAdd
                @onAdd="addMergeGroupPluginConfig(groupKey)"
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
                      @click="deleteMergeGroupPluginConfig(groupKey, index)"
                    ></i>
                  </div>
                </template>
              </HBlock>
            </template>
          </HBlock>
        </el-carousel-item>
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
import { isEmpty, isObject } from 'lodash-es';
export default {
  name: 'MergeConfig',
  props: {
    params: {
      type: Object,
      default: () => {}
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
      config: JSON.parse(JSON.stringify(default_data.merge)),
      cacheConfig: JSON.parse(JSON.stringify(default_data.merge)),
      isOpenMergeConfig: false,

      currentIndex: 0,
      carouselHeight: '810px'
    };
  },
  computed: {
    groupNameList() {
      return Object.keys(this.config || {});
    },
    currentGroupName({ groupNameList }) {
      return groupNameList[this.currentIndex];
    }
  },
  watch: {
    isOpenMergeConfig: {
      handler: function (val) {
        // marge配置项为空时，自动添加一个配置项
        if (val && (!this.config || (isObject(this.config) && isEmpty(this.config)))) {
          this.addMergeGroupConfig();
        }
      },
      immediate: true
    },
    // TODO：初始化逻辑优化
    isOpenNewComponentsConfig: {
      handler: function (value) {
        console.log(value);
      }
    },
    config: {
      handler: function (value) {
        this.$emit('updateConfig', {
          field: 'merge',
          value
        });
      },
      deep: true
    }
  },
  created() {
    this.config = JSON.parse(JSON.stringify(default_data.merge));
  },
  methods: {
    initConfig(info) {
      this.config = JSON.parse(JSON.stringify(info.merge || {}));
      if (!info.merge || isEmpty(info.merge)) {
        this.addMergeGroupConfig();
        this.isOpenMergeConfig = false;
      } else {
        this.isOpenMergeConfig = true;
      }
    },
    getConfig() {
      return this.config;
    },

    handleChangeType(type, groupKey) {
      if (type === 'unet') {
        this.$set(this.config[groupKey], 'plugin', [default_group_plugin]);
      } else {
        this.$delete(this.config[groupKey], 'plugin');
      }
    },

    addMergeGroupLoraConfig(groupKey) {
      if (!this.config[groupKey].lora) {
        this.$set(this.config[groupKey], 'lora', []);
      }
      this.config[groupKey].lora.push(
        JSON.parse(JSON.stringify(default_data.merge.group1.lora[0]))
      );
    },
    deleteMergeGroupLoraConfig(groupKey, index) {
      this.config[groupKey].lora.splice(index, 1);
      if (this.config[groupKey].lora.length === 0) {
        this.$set(this.config[groupKey], 'lora', null);
      }
    },
    addMergeGroupPartConfig(groupKey) {
      if (!this.config[groupKey].part) {
        this.$set(this.config[groupKey], 'part', []);
      }
      this.config[groupKey].part.push(
        JSON.parse(JSON.stringify(default_data.merge.group1.part[0]))
      );
    },
    deleteMergeGroupPartConfig(groupKey, index) {
      this.config[groupKey].part.splice(index, 1);
      if (this.config[groupKey].part.length === 0) {
        this.$set(this.config[groupKey], 'part', null);
      }
    },
    addMergeGroupPluginConfig(groupKey) {
      if (!this.config[groupKey].plugin) {
        this.$set(this.config[groupKey], 'plugin', []);
      }
      this.config[groupKey].plugin.push(default_group_plugin);
    },
    deleteMergeGroupPluginConfig(groupKey, index) {
      this.config[groupKey].plugin.splice(index, 1);
      if (this.config[groupKey].plugin.length === 0) {
        this.$set(this.config[groupKey], 'plugin', null);
      }
    },
    addMergeGroupConfig() {
      if (!this.config) {
        this.$set(this, 'config', {});
      }
      const length = Object.keys(this.config || {}).length;
      this.$set(
        this.config,
        `group${length + 1}`,
        JSON.parse(JSON.stringify(default_data.merge.group1))
      );
    },
    deleteMergeGroupConfig(groupKey) {
      this.$delete(this.config, groupKey);
      if (Object.keys(this.config || {}).length === 0) {
        this.isOpenMergeConfig = false;
        this.config = null;
      }
    },
    preMergeGroupConfig() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
        this.$refs.carouselRef.prev();
      }
    },
    nextMergeGroupConfig() {
      if (this.currentIndex < Object.keys(this.config || {}).length - 1) {
        this.currentIndex += 1;
        this.$refs.carouselRef.next();
      }
    },
    handleChangeMask(e, groupKey, index) {
      this.config[groupKey].lora[index].mask = e === '-1' ? null : e.split(',').map(Number);
    },
    handleSwitchMergeConfig(val) {
      this.$emit('onOpen', val);
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
