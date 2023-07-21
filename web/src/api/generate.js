import { $post, $get, $delete } from './base';

// 获取生成配置
export const getGenerateConfig = (sn) => {
  return $get('/api/v1/generate', { sn });
};

// 生成图片
export const generateAction = (data) => {
  return $post('/api/v1/generate', { ...data });
};
// 获取进度 轮询
export const getGenerateProgress = (sn) => {
  return $get(`/api/v1/generate/progress?sn=${sn}`);
};
// 中断生成
export const stopGenerate = (sn) => {
  return $delete(`/api/v1/generate/progress?sn=${sn}`);
};

export const generatePtAction = (data) => {
  return $post('/api/v1/pt', { ...data });
};

export const getPtAction = (sn) => {
  return $get(`/api/v1/pt?sn=${sn}`);
};

export const generateDatasetAction = (data) => {
  return $post('/api/v1/dataset', { ...data });
};

export const getDatesetAction = (sn) => {
  return $get(`/api/v1/dataset?sn=${sn}`);
};
