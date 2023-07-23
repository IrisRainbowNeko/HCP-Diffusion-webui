import { defineStore } from 'pinia';
import { default_data, default_train_data } from '@/constants/index';
import { cloneDeep } from 'lodash-es';
const useConfigStore = defineStore('config', {
  state: () => ({
    generate: cloneDeep(default_data),
    train: cloneDeep(default_train_data),
    pt: {},
    dataset: {}
  })
});

export default useConfigStore;
