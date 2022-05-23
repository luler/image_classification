# orator数据迁移配置文件
DATABASES = {
    'default': 'sqlite',
    'mysql': {
        'driver': 'mysql',
        'host': '10.10.11.99',
        'database': 'image_classification',
        'user': 'root',
        'password': 'root',
        'prefix': ''
    },
    'sqlite': {
        'driver': 'sqlite',
        'database': 'image_classification.db',
        'prefix': ''
    }
}
