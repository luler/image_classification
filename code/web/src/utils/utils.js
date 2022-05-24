/**
 * 设置存储
 * @param key
 * @param value
 * @param expires //超时时间，单位秒
 * @returns {boolean}
 */
import {extra_config} from "../../config/extra.config";
import routeConfigData from '../../config/routes';
import Settings from "../../config/defaultSettings";

export function setStorage(key, value, expires = null) {
  var temp = {
    value: value,
  };
  if (expires !== null) {
    temp.expires = expires + parseInt(new Date().getTime() / 1000);
  }

  localStorage.setItem(key, JSON.stringify(temp));
  return true;
}

/**
 * 获取存储
 * @param key
 * @returns {string | number|boolean}
 */
export function getStorage(key) {
  const time = parseInt(new Date().getTime() / 1000);
  var res = localStorage.getItem(key);
  res = JSON.parse(res);
  if (res == null || !res.hasOwnProperty('value')) {
    return false;
  }
  if (!res.hasOwnProperty('expires')) {
    return res.value;
  }
  if (res.expires >= time) {
    return res.value;
  }
  localStorage.removeItem(key);
  return false;
}

/**
 * 移除缓存
 * @param key
 */
export function removeStorage(key) {
  localStorage.removeItem(key);
}

/**
 * 获取url参数
 * @param name
 * @returns {string|null}
 */
export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return undefined;
}

/**
 * 获取带前缀的绝对地址
 * @param path
 * @returns {*}
 */
export function getFullPath(path) {
  const prefix = extra_config.routePrefix ? extra_config.routePrefix.replace(/\/$/, '') : ''
  return prefix + path;
}

/**
 * 根据页面路径获取当前页面标题
 * @param path
 * @returns {string}
 */
export function getPageTitleByPath(path) {
  path = path || '/'
  const getName = (routeData, path) => {
    // console.log(path, routeData)
    let res = ''
    for (const i in routeData) {
      if ((routeData[i].path + '').toLowerCase() === (path + '').toLowerCase()) {
        res = routeData[i].name || res
        break
      } else {
        const routes = routeData[i].routes || [];
        res = getName(routes, path)
        if (res !== '未设置') {
          break
        }
      }
    }
    return res || '未设置'
  }
  let res
  if (path === '/') {
    res = Settings.title
  } else { // 去路由中找
    res = getName(routeConfigData, path)
  }
  return res
}

/**
 * 字节可读转换
 * @param bytes
 * @returns {string}
 */
export function bytesToSize(bytes) {
  if (bytes === 0) return '0B';
  let k = 1024;
  let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
}


