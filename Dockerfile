# 使用官方PaddlePaddle镜像
FROM paddlepaddle/paddle:2.3.0

# 维护者信息
MAINTAINER 1207032539@qq.com

# 复制项目文件到镜像中
COPY . /root/work

# 设置工作目录
WORKDIR /root/work

# 安装Python依赖
RUN pip install -r requirements.txt -i https://mirror.baidu.com/pypi/simple && rm -rf ~/.cache/pip

# 暴露端口
EXPOSE 5000

# 运行应用程序
CMD ["python", "app.py"]