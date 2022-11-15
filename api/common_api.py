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
    field = ['score_thres', 'return_k']
    param = tool.common.get_request_param(field)
    score_thres = param.get('score_thres', setting.PP_CONFIG['IndexProcess']['score_thres'])
    return_k = param.get('return_k', setting.PP_CONFIG['IndexProcess']['return_k'])
    score_thres = float(score_thres)
    return_k = int(return_k)
    if score_thres <= 0 or score_thres > 1:
        raise Exception('图片相似度取值范围0-1')
    if return_k <= 0:
        raise Exception('返回结果数量为大于0的整数')
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
    last_file = prefix + tool.common.md5_file(filename) + '.' + ext
    shutil.move(filename, last_file)

    img = cv2.imread(last_file)[:, :, ::-1]
    result = {}
    output = current_app.system_predictor.predict(img, score_thres=score_thres, return_k=return_k)
    if result_image == '1':
        draw_bbox_results(img, output, last_file, save_dir='static/predict_images',
                          font_path="./deploy/utils/simfang.ttf")
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
