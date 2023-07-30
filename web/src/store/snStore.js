import { defineStore } from 'pinia';
import useGenerateStore from './generateStore';
import useTrainStore from './trainStore';
export default defineStore('sn', {
  state: () => ({
    generate_sn: localStorage.getItem('generate_sn') || '',
    pt_sn: localStorage.getItem('pt_sn') || '',
    dataset_sn: localStorage.getItem('dataset_sn') || '',
    train_sn: localStorage.getItem('train_sn') || ''
  }),
  getters: {
    generateSn(state) {
      const generateStore = useGenerateStore();
      return (
        state.generate_sn || (generateStore?.generate_server_yaml_file_options[0]?.value ?? '')
      );
    },
    ptSn(state) {
      return state.train_sn || '';
    },
    datasetSn(state) {
      return state.dataset_sn || '';
    },
    trainSn(state) {
      const trainStore = useTrainStore();
      return state.train_sn || (trainStore?.train_server_yaml_file_options[0]?.value ?? '');
    }
  },
  actions: {
    setGenerateSnSn(sn) {
      this.generate_sn = sn;
      localStorage.setItem('generate_sn', sn);
    },
    setPtSnSn(sn) {
      this.pt_sn = sn;
      localStorage.setItem('pt_sn', sn);
    },
    setDatasetSnSn(sn) {
      this.dataset_sn = sn;
      localStorage.setItem('dataset_sn', sn);
    },
    setTrainSnSn(sn) {
      this.train_sn = sn;
      localStorage.setItem('train_sn', sn);
    }
  }
});
