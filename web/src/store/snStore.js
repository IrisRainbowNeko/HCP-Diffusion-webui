import { defineStore } from 'pinia';
export default defineStore('sn', {
  state: () => ({
    generate_sn: localStorage.getItem('generate_sn') || '',
    pt_sn: localStorage.getItem('pt_sn') || '',
    dataset_sn: localStorage.getItem('dataset_sn') || '',
    train_sn: localStorage.getItem('train_sn') || ''
  }),
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
