import { $post, $get } from './base';
// 上传文件
export const uploadFile = (data) => {
  return $post('/file/upload', data);
};
// 获取最新dir
export const getGenerateDir = (data) => {
  return $get('/file/dir', data);
};
