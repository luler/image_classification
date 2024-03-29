import os

from flask import request

from api import common_api, login_api, label_api, image_api
from tool import jwt_tool

# 接口路由，全部写在这里
import tool.common


def add_new_routes(app):
    # 全局异常捕获处理
    @app.errorhandler(Exception)
    def errorhandler(error):
        error = str(error)
        code = 400
        if error == '授权凭证无效':
            code = 401
        return tool.common.json_return(error, [], code)

    @app.before_first_request
    def before_first_request_instance():
        os.system('orator migrate -c orator_database.py -f')

    @app.before_request
    def before_request_instance():
        request.user_id = 0
        path = request.path.lower()
        if path.startswith('/api/auth'):
            token = request.headers.get('Authorization', '')
            res = jwt_tool.jwt_decode(token)
            request.user_id = res['user_id']

    # 自定义路由
    app.add_url_rule('/api/login', view_func=login_api.login, methods=['POST'])
    app.add_url_rule('/api/casLogin', view_func=login_api.casLogin, methods=['GET'])
    # 需要登录的接口
    app.add_url_rule('/api/auth/predict', view_func=common_api.predict, methods=['POST'])
    app.add_url_rule('/api/auth/rebuildIndex', view_func=common_api.rebuildIndex, methods=['POST'])
    app.add_url_rule('/api/auth/editPassword', view_func=login_api.editPassword, methods=['POST'])
    app.add_url_rule('/api/auth/getUserInfo', view_func=login_api.getUserInfo, methods=['POST'])
    app.add_url_rule('/api/auth/getLabel', view_func=label_api.getLabel, methods=['POST'])
    app.add_url_rule('/api/auth/saveLabel', view_func=label_api.saveLabel, methods=['POST'])
    app.add_url_rule('/api/auth/delLabel', view_func=label_api.delLabel, methods=['POST'])
    app.add_url_rule('/api/auth/getImage', view_func=image_api.getImage, methods=['POST'])
    app.add_url_rule('/api/auth/delImage', view_func=image_api.delImage, methods=['POST'])
    app.add_url_rule('/api/auth/uploadImage', view_func=image_api.uploadImage, methods=['POST'])
