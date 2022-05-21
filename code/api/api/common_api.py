import hashlib
import os.path
import re
import shutil
import uuid

import cv2

import setting
import tool.common
import tool.validate
from flask import current_app, request
from deploy.python.predict_system import SystemPredictor


# 初始化预测对象
def __init_predictor():
    current_app.system_predictor = SystemPredictor(setting.PP_CONFIG)


# 测试接口
def predict():
    if hasattr(current_app, 'system_predictor') == False:
        __init_predictor()
    ############################
    file = request.files.get('file')
    if file is None:
        raise Exception('待测图片不能为空')
    ext = re.search(".([a-z|A-Z]*?)$", file.filename).group(1).lower()
    if ext not in ['jpg', 'jpeg', 'png']:
        raise Exception('不支持当前文件后缀名')
    prefix = 'predict_images/'
    filename = prefix + str(uuid.uuid1()) + '.' + ext
    file.save(filename)

    # 很坑，f.read在f.save前，保存的文件会是空的
    last_file = prefix + hashlib.md5(file.read()).hexdigest() + '.' + ext
    shutil.move(filename, last_file)

    img = cv2.imread(last_file)[:, :, ::-1]
    output = current_app.system_predictor.predict(img)
    output = tool.common.json_format_numpy(output)
    return tool.common.json_return('访问成功', output)


# 上传图片
def uploadImage():
    param = tool.common.get_request_param(['label'])
    tool.validate.validate.checkData(param, {
        'label|标签': 'required',
    })
    files = request.files.getlist('files')
    if len(files) == 0:
        raise Exception('图片文件不能为空')
    path = 'deploy/dataset/gallery/' + hashlib.md5(param['label'].encode('utf-8')).hexdigest()
    if os.path.exists(path) is False:
        os.mkdir(path)
    for f in files:
        ext = re.search(".([a-z|A-Z]*?)$", f.filename).group(1).lower()
        if ext not in ['jpg', 'jpeg', 'png']:
            raise Exception('不支持当前文件后缀名')
        filename = str(uuid.uuid1()) + '.' + ext
        f.save(path + '/' + filename)
    return tool.common.json_return('访问成功')
