FROM registry.baidubce.com/paddlepaddle/paddle:2.3.0

MAINTAINER 1207032539@qq.com

COPY ./code/api /root/work

WORKDIR /root/work

RUN pip install -r requirements.txt -i https://mirror.baidu.com/pypi/simple

EXPOSE 5000

CMD ["python","app.py"]