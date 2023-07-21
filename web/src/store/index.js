import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    generate_sn: localStorage.getItem('generate_sn') || '',
    pt_sn: localStorage.getItem('pt_sn') || '',
    dataset_sn: localStorage.getItem('dataset_sn') || '',
    train_sn: localStorage.getItem('train_sn') || ''
  },
  getters: {
    generateSn: (state) => state.generate_sn,
    ptSn: (state) => state.pt_sn,
    datasetSn: (state) => state.dataset_sn,
    trainSn: (state) => state.train_sn
  },
  mutations: {
    setGenerateSnSn(state, sn) {
      state.generate_sn = sn;
      localStorage.setItem('generate_sn', sn);
    },
    setPtSnSn(state, sn) {
      state.pt_sn = sn;
      localStorage.setItem('pt_sn', sn);
    },
    setDatasetSnSn(state, sn) {
      state.dataset_sn = sn;
      localStorage.setItem('dataset_sn', sn);
    },
    setTrainSnSn(state, sn) {
      state.train_sn = sn;
      localStorage.setItem('train_sn', sn);
    }
  },
  actions: {},
  modules: {}
});
