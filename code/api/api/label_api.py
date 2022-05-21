import hashlib
import shutil

from tool import common, validate


# 获取标签列表
def getLabel():
    field = ['search', 'page', 'page_rows']
    param = common.get_request_param(field)
    page = param.get('page', 1)
    page_rows = param.get('page_rows', 10)
    search = param.get('search', '')

    db = common.get_db()
    query = db.query()
    if search != '':
        query.where('name', 'like', f"%{param['search']}%")

    data = db.table('label').where(query).paginate(page_rows, page)

    res = {
        'list': data.to_dict(),
        'total': data.total,
    }

    return common.json_return('获取成功', res)


# 保存标签
def saveLabel():
    field = ['name', 'id', ]
    param = common.get_request_param(field)
    validate.validate.checkData(param, {
        'name': 'required',
    })

    id = param.get('id', 0)
    db = common.get_db()
    if db.table('label').where('id', '!=', id).where('name', param['name']).count() > 0:
        raise Exception('标签名称已存在')
    if id > 0:
        db.table('label').where('id', id).update({
            'name': param['name'],
        })
    else:
        db.table('label').insert({
            'name': param['name'],
        })

    return common.json_return('保存成功')


# 删除标签
def delLabel():
    field = ['ids', ]
    param = common.get_request_param(field)
    validate.validate.checkData(param, {
        'ids|删除项目': 'required|list',
    })

    db = common.get_db()
    db.table('label').where_in('id', param['ids']).delete()
    db.table('image').where_in('label_id', param['ids']).delete()
    # 删除目录
    for id in param['ids']:
        shutil.rmtree('deploy/dataset/gallery/' + hashlib.md5(str(id).encode('utf-8')).hexdigest())

    return common.json_return('删除成功')
