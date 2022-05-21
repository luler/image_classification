import hashlib
import os
import re
import shutil
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
    images = db.table('image').where_in('id', param['ids']).lists('path', 'id')
    db.table('image').where_in('id', param['ids']).delete()
    for id in images:
        os.remove(images[id])

    return common.json_return('删除成功')


# 上传图片
def uploadImage():
    param = common.get_request_param(['label_id'])
    validate.validate.checkData(param, {
        'label_id|标签': 'required',
    })

    db = common.get_db()
    label = db.table('label').where('id', param['label_id']).first()
    if label == None:
        raise Exception('标签不存在')

    files = request.files.getlist('files')
    if len(files) == 0:
        raise Exception('图片文件不能为空')
    path = 'static/gallery/' + hashlib.md5(str(label['id']).encode('utf-8')).hexdigest()
    if os.path.exists(path) is False:
        os.mkdir(path)

    for f in files:
        ext = re.search(".([a-z|A-Z]*?)$", f.filename).group(1).lower()
        if ext not in ['jpg', 'jpeg', 'png']:
            raise Exception('不支持文件后缀名:' + f.filename)
        filename = path + '/' + str(uuid.uuid1()) + '.' + ext
        f.save(filename)
        md5 = common.md5_file(filename)
        last_filename = path + '/' + md5 + '.' + ext
        shutil.move(filename, last_filename)
        if db.table('image').where('label_id', param['label_id']).where('md5', md5).count() > 0:
            continue
        db.table('image').insert({
            'label_id': param['label_id'],
            'name': f.filename,
            'path': last_filename,
            'ext': ext,
            'size': os.path.getsize(last_filename),
            'md5': md5,
        })

    return common.json_return('上传成功')
