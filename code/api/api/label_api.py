from tool import common


# 获取标签列表
def getLabel():
    field = ['search', 'page', 'page_rows']
    param = common.get_request_param(field)
    page = param.get('page', 1)
    page_rows = param.get('page_rows', 10)

    db = common.get_db()
    data = db.table('label').paginate(page_rows, page)

    res = {
        'list': data.to_dict(),
        'total': data.total,
    }

    return common.json_return('获取成功', res)
