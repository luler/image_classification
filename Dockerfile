FROM python:3.7

MAINTAINER 1207032539@qq.com

COPY ./code/api /root/work

WORKDIR /root/work

RUN apt update -y && apt install -y libgl1-mesa-dev

RUN pip install -r requirements.txt -i https://mirror.baidu.com/pypi/simple

EXPOSE 5000

CMD ["python","app.py"]