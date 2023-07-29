import { defineStore } from 'pinia';
import * as _ from 'lodash-es';
import { default_data, default_train_data } from '@/constants/index';
import { cloneDeep } from 'lodash-es';
const generateStorageKey = 'GenerateStorage';
const useConfigStore = defineStore('config', {
  state: () => ({
    generate: JSON.parse(localStorage.getItem(generateStorageKey)) || cloneDeep(default_data),
    train: cloneDeep(default_train_data),
    pt: {},
    dataset: {}
  }),
  getters: {
    storedGenerate() {
      return JSON.parse(localStorage.getItem(generateStorageKey));
    }
  },
  actions: {
    storageGenerate(state) {
      console.log('update', state);
      localStorage.setItem(generateStorageKey, JSON.stringify(state));
    },
    updateGenerate(obj) {
      this.generate = cloneDeep(obj);
    },
    updateGenerateByPath(path, obj) {
      _.set(this.generate, path, cloneDeep(obj));
    }
  }
});

export default useConfigStore;
