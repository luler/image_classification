FROM python:3.7

MAINTAINER 1207032539@qq.com

RUN apt update -y && apt install -y libgl1-mesa-dev && apt-get clean

RUN pip install paddlepaddle==2.3.0 -i https://mirror.baidu.com/pypi/simple && rm -rf ~/.cache/pip

COPY . /root/work

WORKDIR /root/work

RUN pip install -r requirements.txt -i https://mirror.baidu.com/pypi/simple && rm -rf ~/.cache/pip

EXPOSE 5000

CMD ["python","app.py"]