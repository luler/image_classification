# flask变量
# ENV = 'production'
import orator_database

ENV = 'development'

HOST = '0.0.0.0'
PORT = 5000
THREADED = True

# 数据库配置
DATABASES = orator_database.DATABASES

# jwt配置
JWT_SECRET = 'fdhrteh%$%$^&$%#￥@##@￥5252'
JWT_EXPIRE = 7200000

# 初始化账号密码
ADMIN_NAME = 'admin'
ADMIN_PASSWORD = 'linzhou'

# pp-shitu预测配置参数
PP_CONFIG = {
    'Global': {
        'infer_imgs': './deploy/dataset/test_images/test.jpg',
        'det_inference_model_dir': './deploy/models/picodet_PPLCNet_x2_5_mainbody_lite_v1.0_infer/',
        'rec_inference_model_dir': './deploy/models/general_PPLCNet_x2_5_lite_v1.0_infer/',
        'rec_nms_thresold': 0.05,
        'batch_size': 1,
        'image_shape': [3, 640, 640],
        'threshold': 0.2,
        'max_det_results': 5, 'label_list': ['foreground'],
        'use_gpu': False,
        'enable_mkldnn': True,
        'cpu_num_threads': 10,
        'enable_benchmark': True,
        'use_fp16': False,
        'ir_optim': True,
        'use_tensorrt': False,
        'gpu_mem': 8000,
        'enable_profile': False
    },
    'DetPreProcess': {
        'transform_ops': [
            {
                'DetResize': {
                    'interp': 2,
                    'keep_ratio': False,
                    'target_size': [640, 640]
                }
            },
            {
                'DetNormalizeImage': {
                    'is_scale': True,
                    'mean': [0.485, 0.456, 0.406],
                    'std': [0.229, 0.224, 0.225]
                }
            },
            {
                'DetPermute': {}
            }
        ]
    },
    'DetPostProcess': {},
    'RecPreProcess': {
        'transform_ops': [
            {
                'ResizeImage': {
                    'size': 224
                }
            },
            {
                'NormalizeImage': {
                    'scale': 0.00392157,
                    'mean': [0.485, 0.456, 0.406],
                    'std': [0.229, 0.224, 0.225],
                    'order': ''
                }
            },
            {
                'ToCHWImage': None
            }
        ]
    },
    'RecPostProcess': None,
    'IndexProcess': {
        'index_method': 'HNSW32',
        'image_root': './static/gallery/',
        'index_dir': './deploy/index/',
        'data_file': './static/gallery/label.txt',
        'index_operation': 'new',
        'delimiter': '\t',
        'dist_type': 'IP',
        'embedding_size': 512,
        'batch_size': 32,
        'return_k': 5,
        'score_thres': 0.5
    }
}
