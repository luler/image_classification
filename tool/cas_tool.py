# 生成token
import json

import requests
import setting


# 校验code
def check_code(code):
    config = setting.CAS_CONFIG
    url = config['host'] + '/api/auth/checkCode'
    config['code'] = code
    res = requests.post(url, json=config)
    if res.status_code != 200:
        raise Exception('CAS授权码失效')
    res = json.loads(res.content)
    return res['info']['access_token']


# 获取用户信息
def get_user_info(code):
    config = setting.CAS_CONFIG
    url = config['host'] + '/api/auth/getUserInfo'
    headers = {
        'Authorization': check_code(code),
    }
    res = requests.get(url, headers=headers)
    if res.status_code != 200:
        raise Exception('CAS授权码失效')
    res = json.loads(res.content)
    return res['info']
