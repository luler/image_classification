# 图片分类识别工具

安装

```
git clone https://github.com/luler/image_classification.git

pip install -r requirements.txt
```

运行

``` 
python app.py
``` 

目录结构

```
├── README.md
├── api
│        ├── __init__.py
│        └── common_api.py    //接口路由文件
├── app.py           //启动服务
├── requirements.txt
├── route.py         //路由配置文件
├── setting.py       //配置文件
└── tool
    ├── __init__.py
    └── common.py    // 通用函数文件
```