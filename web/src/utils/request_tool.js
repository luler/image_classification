import {stringify} from 'qs';
import {extra_config} from '../../config/extra.config';
import {getAccessToken, loginOut} from "@/utils/authority";
import {notification} from "antd";

/**
 * 检查http状态码，全局提示
 * @param status
 * @param message
 */
function checkHttpStatus(status, message) {
  switch (status) {
    case 200:
      break;
    case 401:
      loginOut();
      window.location.href = extra_config.url401;
      break;
    case 400:
    case 403:
    case 500:
    default:
      notification.error({
        description: '请求出错',
        message: message || '未知错误，请联系开发人员处理',
        duration: 3,
      });
      break;
  }
}

export async function request(url, type, param, headers, is_json) {
  type = type || 'GET';
  param = param || {};
  headers = headers || {};
  is_json = is_json === undefined ? true : is_json;
  let config = {
    method: type,
    headers: headers,
    credentials: 'include',
  };
  switch (type) {
    case 'GET':
      break;
    case 'HEAD':
      break;
    default:
      if (is_json) {
        config.body = JSON.stringify(param);
        config.headers['Content-Type'] = 'application/json; charset=utf-8';
      } else {
        config.body = param;
      }
      break;
  }
  var init_headers = {
    Authorization: getAccessToken(),
  };
  headers = {
    ...init_headers,
    ...headers,
  };
  config.headers = headers;

  return new Promise(function (resolve, reject) {
    fetch(url, config)
      .then(function (res) {
        res.json().then(function (data) {
          checkHttpStatus(data.code, data.message || '未知错误，请联系开发人员处理')
          resolve(data);
        });
      })
      .catch(function (error) {
        notification.error({
          description: '请求失败',
          message: error,
          duration: 3,
        });
        reject(error);
      });
  });
}

export function xmlAyncRequest(url, type, param, headers, is_json) {
  type = type || 'GET';
  param = param || {};
  headers = headers || {};
  is_json = is_json === undefined ? true : is_json;

  var init_headers = {
    Authorization: getAccessToken(),
  };
  headers = {
    ...init_headers,
    ...headers,
  };
  // 同步请求
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open(type, url, false);
  for (var i in headers) {
    xmlhttp.setRequestHeader(i, headers[i]);
  }
  let data = {};
  if (is_json) {
    xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xmlhttp.send(JSON.stringify(param));
    data = JSON.parse(xmlhttp.responseText);
  } else {
    xmlhttp.send(null);
    data = xmlhttp.responseText;
  }

  checkHttpStatus(xmlhttp.status, data.message || '未知错误，请联系开发人员处理')

  return data;
}

// eslint-disable-next-line camelcase
export function request_post(url, param, headers, is_json, is_async) {
  param = param || {};
  headers = headers || {};
  is_json = is_json === undefined ? true : is_json;
  is_async = is_async === undefined ? true : is_async;
  if (is_async) {
    return request(url, 'POST', param, headers, is_json);
  }
  return xmlAyncRequest(url, 'POST', param, headers, is_json)

}

export function request_get(url, param, headers, is_json, is_async) {
  param = param || {};
  headers = headers || {};
  is_json = is_json === undefined ? true : is_json;
  is_async = is_async === undefined ? true : is_async;
  const query = stringify(param);
  if (is_async) {
    return request(url + (query === '' ? '' : (`?${query}`)), 'GET', {}, headers, is_json);
  }
  return xmlAyncRequest(url + (query === '' ? '' : (`?${query}`)), 'GET', {}, headers, is_json)
}
