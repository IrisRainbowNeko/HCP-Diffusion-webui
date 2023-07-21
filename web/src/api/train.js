import { $get, $post, $delete } from './base';

// 获取训练config
export const getTrain = async (sn) => {
  return $get('/api/v1/train', { sn });
};
// 更新训练config
export const updateTrain = async (data) => {
  return $post('/api/v1/train', { ...data });
};
// 获取训练状态 轮训
export const getTrainStatus = async (data) => {
  return $get('/api/v1/train/progress', data);
};
// 刷新获取最新dir
export const getTrainDir = async (data) => {
  return $get('/api/v1/file/dir', data);
};
// 中断
export const stopTrain = async (sn) => {
  return $delete(`/api/v1/train/progress?sn=${sn}`);
};
