import time

import jwt

import setting


# 生成token
def jwt_encode(data):
    dict = {
        'exp': int(time.time()) + setting.JWT_EXPIRE,  # 过期时间
        'iat': int(time.time()),  # 开始时间
        'iss': 'luler',  # 签名
        'data': data
    }

    res = jwt.encode(dict, setting.JWT_SECRET, algorithm='HS256')
    return res


# 解析token
def jwt_decode(token):
    try:
        res = jwt.decode(token, setting.JWT_SECRET, algorithms=["HS256"])
    except Exception as e:
        raise Exception('授权凭证无效')
    return res['data']
