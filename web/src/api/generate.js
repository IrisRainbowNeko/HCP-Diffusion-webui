import { $post, $get, $delete } from './base';

// 获取生成配置
export const getGenerateConfig = (sn) => {
  return $get('/generate', { sn });
};

// 生成图片
export const generateAction = (data) => {
  return $post('/generate', { ...data });
};
// 获取进度 轮询
export const getGenerateProgress = (sn) => {
  return $get(`/generate/progress?sn=${sn}`);
};
// 中断生成
export const stopGenerate = (sn) => {
  return $delete(`/generate/progress?sn=${sn}`);
};

export const generatePtAction = (data) => {
  return $post('/pt', { ...data });
};

export const getPtAction = (sn) => {
  return $get(`/pt?sn=${sn}`);
};

export const generateDatasetAction = (data) => {
  return $post('/dataset', { ...data });
};

export const getDatesetAction = (sn) => {
  return $get(`/dataset?sn=${sn}`);
};
