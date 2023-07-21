import { $post, $get } from './base';
// 上传文件
export const uploadFile = (data) => {
  return $post('/api/v1/file/upload', data);
};
// 获取最新dir
export const getGenerateDir = (data) => {
  return $get('/api/v1/file/dir', data);
};
