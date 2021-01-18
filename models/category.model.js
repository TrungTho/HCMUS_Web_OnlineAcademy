const db = require("../utils/database");
const TABLE_NAME = "category";

module.exports = {
  all() {
    return db.load(`select * from ${TABLE_NAME}`);
  },

  mostView() {
    return db.load(`select * from ${TABLE_NAME} limit 6`);
  },

  add(newObj) {
    return db.add(newObj, TABLE_NAME);
  },

  del(Obj) {
    const condition = { ID_CATE: Obj.ID_CATE };
    return db.del(condition, TABLE_NAME);
  },

  update(Obj) {
    const condition = { ID_CATE: Obj.ID_CATE };
    return db.update(Obj, condition, TABLE_NAME);
  },

  async getSingle(id) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where ID_CATE = ${id} `
    );
    if (rows.length === 0) return null;
    return rows[0];
  },
};
