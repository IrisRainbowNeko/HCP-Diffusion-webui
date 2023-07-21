// Desc: 工具函数

// 引入message
import { Message } from 'element-ui';
import prompt from '@/constants/prompt';

/**
 * 加工options
 * @param {*} options [a]
 * @returns {Object} {label: a, value: a}
 */
export const handleOptions = (options) => {
  return options.map((item) => {
    if (typeof item === 'object') {
      return item;
    }
    return {
      label: item,
      value: item
    };
  });
};

/**
 * 'a.b.c.d', {a: {b: {c: {d: 1}}}} => 1
 * 根据path对象 设置好对应的值
 * @param {*} obj
 * @param {*} path
 * @param {*} value
 */
export const setDeepValue = (obj, path, value) => {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    // 如果当前属性不存在，创建一个空对象
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
};

/**
 * 判断一段字符串是否是数组还是对象字符串
 * @param {*} value
 * @returns
 */
export const isObjectOrArray = (str) => {
  try {
    const obj = JSON.parse(str);
    if (typeof obj === 'object' && obj !== null) {
      return Array.isArray(obj) ? 'array' : 'object';
    }
  } catch (error) {
    // 解析失败则不是数组或对象字符串
    return false;
  }
  return false;
};

/**
 * 校验参数是否合法
 */
export const validateParams = (requiredField, params) => {
  const requiredFieldKeys = Object.keys(requiredField);
  // 对比key
  const checkKey = (key) => {
    for (let i = 0; i < requiredFieldKeys.length; i++) {
      const key_ = requiredFieldKeys[i];
      const regexStr = key_.replace(/\*/g, '\\w+').replace(/\./g, '\\.');
      // 将 * 替换为 \w+ 匹配一个或多个字母数字字符，将 . 替换为 \. 匹配点号.
      const regex = new RegExp(`^${regexStr}$`); // 使用构造函数创建正则表达式
      if (regex.test(key)) {
        return key_;
      }
    }
    return false;
  };
  function validateObject(object, prefix = '', errorMap = {}) {
    for (const key in object) {
      let currentKey = prefix ? `${prefix}.${key}` : key;
      // 判断
      const newKey = checkKey(currentKey);
      if (newKey) {
        currentKey = newKey;
      }

      const rule = requiredField[currentKey];
      if (rule) {
        const validate = rule.validate || ((val) => !['', undefined, null].includes(val));
        if (!validate(object[key])) {
          errorMap[currentKey] = rule.message;
          // 停止循环
          continue;
        }
      }
      if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
        validateObject(object[key], currentKey, errorMap);
      } else if (Array.isArray(object[key])) {
        for (let i = 0; i < object[key].length; i++) {
          if (typeof object[key][i] === 'object' && !Array.isArray(object[key][i])) {
            validateObject(object[key][i], `${currentKey}.${i}`, errorMap);
          }
        }
      }
    }
    return errorMap;
  }
  const errorMap = validateObject(params);
  Object.keys(errorMap).forEach((key) => {
    setTimeout(() => {
      Message.error(errorMap[key]);
    }, 0);
  });
  return Object.keys(errorMap).length === 0;
};

export const getPropertyByPath = (path, obj = prompt) => {
  const paths = path.split('.');
  let value = obj;
  for (const key of paths) {
    if (key in value) {
      value = value[key];
    } else {
      value = '';
      break;
    }
  }
  return value;
};
