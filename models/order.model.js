const db = require("../utils/database");
const TABLE_NAME = "orders";

module.exports = {
  all() {
    return db.load(`select * from ${TABLE_NAME}`);
  },

  allByUserId(id) {
    return db.load(`select * from ${TABLE_NAME} where ID_USER = ${id}`);
  },

  async add(newObj) {
    const ret = await db.add(newObj, TABLE_NAME);
    newObj.ID_ORDER = ret.insertId;
  },

  del(Obj) {
    const condition = { ID_ORDER: Obj.ID_ORDER };
    return db.del(condition, TABLE_NAME);
  },

  update(Obj) {
    const condition = { ID_ORDER: Obj.ID_ORDER };
    return db.update(Obj, condition, TABLE_NAME);
  },

  async getSingle(id) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where ID_ORDER = ${id} `
    );
    if (rows.length === 0) return null;
    return rows[0];
  },
};
