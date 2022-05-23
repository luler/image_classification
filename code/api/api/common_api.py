import hashlib
import re
import shutil
import uuid

import cv2

import setting
import tool.common
import tool.validate
from flask import current_app, request
from deploy.python.predict_system import SystemPredictor
from deploy.utils.draw_bbox import draw_bbox_results
import build_gallery


# 初始化预测对象
def __init_predictor():
    current_app.system_predictor = SystemPredictor(setting.PP_CONFIG)


# 测试接口
def predict():
    if hasattr(current_app, 'system_predictor') == False:
        __init_predictor()
    ############################
    file = request.files.get('file')
    param = tool.common.get_request_param(['result_image'])
    result_image = str(param.get('result_image', 0))
    if file is None:
        raise Exception('待测图片不能为空')
    ext = re.search(".([a-z|A-Z]*?)$", file.filename).group(1).lower()
    if ext not in ['jpg', 'jpeg', 'png']:
        raise Exception('不支持当前文件后缀名')
    prefix = 'static/predict_images/'
    filename = prefix + str(uuid.uuid1()) + '.' + ext
    file.save(filename)

    # 很坑，f.read在f.save前，保存的文件会是空的
    last_file = prefix + hashlib.md5(file.read()).hexdigest() + '.' + ext
    shutil.move(filename, last_file)

    img = cv2.imread(last_file)[:, :, ::-1]
    result = {}
    output = current_app.system_predictor.predict(img)
    if result_image == '1':
        draw_bbox_results(img, output, last_file, save_dir='static/predict_images')
        result['result_image'] = '/' + last_file
    output = tool.common.json_format_numpy(output)
    result['result'] = output
    return tool.common.json_return('访问成功', result)


# 重建索引
def rebuildIndex():
    build_gallery.building()
    if hasattr(current_app, 'system_predictor') != False:
        del current_app.system_predictor
    return tool.common.json_return('重建完成')
