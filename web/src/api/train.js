import { $get, $post, $delete } from './base';

// 获取训练config
export const getTrain = async (sn) => {
  return $get('/train', { sn });
};
// 更新训练config
export const updateTrain = async (data) => {
  return $post('/train', { ...data });
};
// 获取训练状态 轮训
export const getTrainStatus = async (data) => {
  return $get('/train/progress', data);
};
// 刷新获取最新dir
export const getTrainDir = async (data) => {
  return $get('/file/dir', data);
};
// 中断
export const stopTrain = async (sn) => {
  return $delete(`/train/progress?sn=${sn}`);
};
