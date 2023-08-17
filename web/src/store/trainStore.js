import { defineStore } from 'pinia';
import { default_train_data } from '@/constants/index';
import { cloneDeep } from 'lodash-es';
import { handleOptions } from '@/utils';
const trainStorageKey = 'TrainStorage';
const useTrainStore = defineStore('trainStore', {
  state: () => ({
    train: JSON.parse(localStorage.getItem(trainStorageKey)) || cloneDeep(default_train_data),
    train_server_yaml_file: [],
    pretrained_model_name_or_path: [],
    tokenizer_pt_train_name: []
  }),
  getters: {
    storedTrain() {
      return JSON.parse(localStorage.getItem(trainStorageKey));
    },
    train_server_yaml_file_options() {
      return handleOptions(this.train_server_yaml_file);
    },
    pretrained_model_name_or_path_options() {
      return handleOptions(this.pretrained_model_name_or_path);
    },
    tokenizer_pt_train_name_options() {
      return handleOptions(this.tokenizer_pt_train_name);
    }
  },
  actions: {
    storageTrain(state) {
      localStorage.setItem(trainStorageKey, JSON.stringify(state));
    }
  }
});

export default useTrainStore;
