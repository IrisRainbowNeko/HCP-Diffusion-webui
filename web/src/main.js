import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/style/init.scss';
import 'element-ui/lib/theme-chalk/index.css';
import HConfigRange from '@/components/HConfigRange.vue';
import HConfigSelect from '@/components/HConfigSelect.vue';
import HConfigInput from '@/components/HConfigInput.vue';
import HConfigInputNumber from '@/components/HConfigInputNumber.vue';
import HBlock from '@/components/HBlock.vue';
import HConfigTagSelect from '@/components/HConfigTagSelect.vue';
import HConfigInputSum from '@/components/HConfigInputSum.vue';
import HCollapse from '@/components/HCollapse.vue';
import HPreviewImg from '@/components/HPreviewImg';
import hevueImgPreview from 'hevue-img-preview';
import {
  Message,
  Tabs,
  TabPane,
  Input,
  Button,
  Select,
  Option,
  InputNumber,
  Checkbox,
  Carousel,
  CarouselItem,
  Progress,
  Switch,
  Radio,
  RadioGroup,
  Tooltip,
  Dialog,
  Collapse,
  CollapseItem,
  Scrollbar
} from 'element-ui';
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Input);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(InputNumber);
Vue.use(Checkbox);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Progress);
Vue.use(Switch);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Scrollbar);

Vue.config.productionTip = false;

Vue.prototype.$message = Message;

Vue.component('HConfigRange', HConfigRange);
Vue.component('HConfigSelect', HConfigSelect);
Vue.component('HConfigInput', HConfigInput);
Vue.component('HConfigInputNumber', HConfigInputNumber);
Vue.component('HBlock', HBlock);
Vue.component('HConfigTagSelect', HConfigTagSelect);
Vue.component('HConfigInputSum', HConfigInputSum);
Vue.component('HCollapse', HCollapse);
Vue.component('HPreviewImg', HPreviewImg);
Vue.component('HPreviewImg', HPreviewImg);
Vue.component('HevueImgPreview', hevueImgPreview);
Vue.use(hevueImgPreview);

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
