import Vue from 'vue';
import { defineStore } from 'pinia';
import { default_generate_data } from '@/constants/index';
import { cloneDeep } from 'lodash-es';
import { getGenerateDir } from '@/api/file';
import { handleOptions } from '@/utils/index';
const generateStorageKey = 'GenerateStorage';

export const merge_group_lora_path_key = 'merge_group_lora_path';
export const merge_group_part_path_key = 'merge_group_part_path';
export const merge_group_plugin_controlnet1_path_key = 'merge_group_plugin_controlnet1_path';

const useGenerateStore = defineStore('generateStore', {
  state: () => ({
    generate:
      JSON.parse(localStorage.getItem(generateStorageKey)) || cloneDeep(default_generate_data),
    generate_server_yaml_file: [],
    merge_group_lora_path: [],
    merge_group_part_path: [],
    merge_group_plugin_controlnet1_path: [],
    pretrained_model_name_or_path: []
  }),
  getters: {
    storedGenerate() {
      return JSON.parse(localStorage.getItem(generateStorageKey));
    },
    generate_server_yaml_file_options() {
      return handleOptions(this.generate_server_yaml_file);
    },
    merge_group_part_path_options() {
      return handleOptions(this.merge_group_part_path);
    },
    merge_group_plugin_controlnet1_path_options() {
      return handleOptions(this.merge_group_plugin_controlnet1_path);
    },
    pretrained_model_name_or_path_options() {
      return handleOptions(this.pretrained_model_name_or_path);
    }
  },
  actions: {
    storageGenerate(state) {
      localStorage.setItem(generateStorageKey, JSON.stringify(state));
    },
    async refreshTemplate(field) {
      const result = await getGenerateDir({ path: field }).catch(() => {
        Vue.prototype.$message.error(`fetch setting ${field} failed`);
      });
      if (!result) return;
      const { files = [] } = result;
      switch (field) {
        case merge_group_lora_path_key:
          this.merge_group_lora_path = files;
          break;
        case merge_group_part_path_key:
          this.merge_group_part_path = files;
          break;
        case merge_group_plugin_controlnet1_path_key:
          this.merge_group_plugin_controlnet1_path = files;
          break;
      }
    }
  }
});

export default useGenerateStore;
