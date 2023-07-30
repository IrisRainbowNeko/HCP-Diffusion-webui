import { defineStore } from 'pinia';
import * as _ from 'lodash-es';
import { default_train_data } from '@/constants/index';
import { cloneDeep } from 'lodash-es';
const trainStorageKey = 'TrainStorage';
const useTrainStore = defineStore('trainStore', {
  state: () => ({
    train: JSON.parse(localStorage.getItem(trainStorageKey)) || cloneDeep(default_train_data),
    pretrained_model_name_or_path_options: [],
    tokenizer_pt_train_name_options: []
  }),
  getters: {
    storedTrain() {
      return JSON.parse(localStorage.getItem(trainStorageKey));
    }
  },
  actions: {
    storageTrain(state) {
      localStorage.setItem(trainStorageKey, JSON.stringify(state));
    },
    updateTrainByPath(path, obj) {
      _.set(this.train, path, cloneDeep(obj));
    }
  }
});

export default useTrainStore;
