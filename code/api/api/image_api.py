import hashlib
import os
import re
import uuid

from flask import request
from tool import common, validate


# 获取图片列表
def getImage():
    field = ['label_id', 'page', 'page_rows']
    param = common.get_request_param(field)
    validate.validate.checkData(param, {
        'label_id|标签': 'required',
    })
    page = param.get('page', 1)
    page_rows = param.get('page_rows', 10)

    db = common.get_db()

    data = db.table('image').where('label_id', param['label_id']).paginate(page_rows, page)

    res = {
        'list': data.to_dict(),
        'total': data.total,
    }

    return common.json_return('获取成功', res)


# 删除图片
def delImage():
    field = ['ids', ]
    param = common.get_request_param(field)
    validate.validate.checkData(param, {
        'ids|删除项目': 'required|list',
    })

    db = common.get_db()
    db.table('image').where_in('id', param['ids']).delete()

    return common.json_return('删除成功')


# 上传图片
def uploadImage():
    param = common.get_request_param(['label'])
    validate.validate.checkData(param, {
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
    return common.json_return('访问成功')
