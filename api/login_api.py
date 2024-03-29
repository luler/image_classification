import datetime
import hashlib

from flask import request, redirect
from orator import DatabaseManager

import setting

from tool import common, validate, jwt_tool, cas_tool


# 登录
def login():
    field = ['name', 'password']
    param = common.get_request_param(field)
    validate.validate.checkData(param, {
        'name|账号': 'required',
        'password|密码': 'required',
    })

    db = DatabaseManager(setting.DATABASES)
    user = db.table('user').where('name', param['name']).first()
    if user == None:
        if param['name'] == 'admin':
            db.table('user').insert({
                'name': setting.ADMIN_NAME,
                'password': hashlib.md5(setting.ADMIN_PASSWORD.encode('utf-8')).hexdigest(),
            })
            user = db.table('user').where('name', param['name']).first()
        else:
            raise Exception('用户不存在')
    if user['password'] != hashlib.md5(param['password'].encode('utf-8')).hexdigest():
        raise Exception('输入密码有误')

    token = jwt_tool.jwt_encode({
        'user_id': user['id']
    })

    res = {
        'token': token,
        'live_time': setting.JWT_EXPIRE
    }

    return common.json_return('访问成功', res)


# CAS登录
def casLogin():
    field = ['code', 'open_id']
    param = common.get_request_param(field)
    validate.validate.checkData(param, {
        'code|授权码': 'required',
    })

    user_info = cas_tool.get_user_info(param['code'])

    db = common.get_db()
    # 默认登录admin
    user = db.table('user').where('name', 'admin').first()
    if user == None:
        db.table('user').insert({
            'name': setting.ADMIN_NAME,
            'password': hashlib.md5(setting.ADMIN_PASSWORD.encode('utf-8')).hexdigest(),
        })
        user = db.table('user').where('name', param['name']).first()

    token = jwt_tool.jwt_encode({
        'user_id': user['id']
    })

    return redirect('/?authorization=' + token)


# 获取用户信息
def getUserInfo():
    user = common.get_db().table('user') \
        .where('id', request.user_id) \
        .select('id', 'name') \
        .first()
    return common.json_return('访问成功', user)


# 编辑密码
def editPassword():
    field = ['password', 'confirm_password']
    param = common.get_request_param(field)
    validate.validate.checkData(param, {
        'password|密码': 'required|string|min:8',
        'confirm_password|确认密码': 'required|same:password',
    })
    common.get_db().table('user') \
        .where('id', request.user_id) \
        .update(
        {'password': hashlib.md5(param['password'].encode('utf-8')).hexdigest(), 'updated_at': datetime.datetime.now()})
    return common.json_return('修改成功')
