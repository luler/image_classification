import deploy.python.build_gallery
import setting
from tool import common


def building():
    db = common.get_db()

    res = db.table('image as a') \
        .join('label as b', 'a.label_id', '=', 'b.id') \
        .select('b.name', 'a.path') \
        .lists('name', 'path')

    with open('./static/gallery/label.txt', 'w', encoding='utf-8') as f:
        for path in res:
            path_temp = path.replace('static/gallery/', '')
            f.write(f"{path_temp}\t{res[path]}\n")

    config = setting.PP_CONFIG
    deploy.python.build_gallery.main(config)


if __name__ == '__main__':
    building()
