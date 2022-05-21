from tool import common

db = common.get_db()
res = db.table('label').paginate(10, 1)

print(res.total,res.to_json())
