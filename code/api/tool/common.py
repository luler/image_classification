# 接口通用返回格式
import urllib
import cv2
import numpy
from flask import request
from orator import DatabaseManager

import setting


def json_return(message='', info=[], code=200):
    from flask import jsonify
    return jsonify({
        'code': int(code),
        'message': message,
        'info': info,
    })


# 获取请求参数
def get_request_param(fields=[]):
    res = {}
    # get参数
    info = request.args
    if info != None:
        for key in info:
            res[key] = info[key]
    # post参数 json
    info = request.get_json(force=True, silent=True)
    if info != None:
        for key in info:
            res[key] = info[key]
    # post参数x-www-form-urlencoded/form-data
    info = request.form
    if info != None:
        for key in info:
            res[key] = info[key]
    # 筛选需要的字段
    if len(fields) > 0:
        temp = {}
        for field in fields:
            if field in res:
                temp[field] = res[field]
        res = temp

    return res


# numpy数字类型json序列化时，会因为不类型不一致报错，这里统一转为字符串即可
def json_format_numpy(data):
    if isinstance(data, list):
        for k, v in enumerate(data):
            data[k] = json_format_numpy(v)
    elif isinstance(data, dict):
        for k in data:
            data[k] = json_format_numpy(data[k])
    elif isinstance(data, numpy.int32) \
            or isinstance(data, numpy.int64) \
            or isinstance(data, numpy.float32) \
            or isinstance(data, numpy.float64):
        data = str(data)
    return data


# 网络图片直接转为cv2格式
def url_to_image(url):
    # download the image, convert it to a NumPy array, and then read
    # it into OpenCV format
    resp = urllib.request.urlopen(url)
    # bytearray将数据转换成（返回）一个新的字节数组
    # asarray 复制数据，将结构化数据转换成ndarray
    image = numpy.asarray(bytearray(resp.read()), dtype=numpy.uint8)
    # cv2.imdecode()函数将数据解码成Opencv图像格式
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    # return the image
    return image


# 获取数据库连接
def get_db():
    return DatabaseManager(setting.DATABASES)
