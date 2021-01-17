const db = require("../utils/database");
const TABLE_NAME = "course";

module.exports = {
  all() {
    return db.load(`select * from ${TABLE_NAME} where ISDISABLE = 0`);
  },

  allWithAscendingOrder(orderField) {
    return db.load(
      `select * from ${TABLE_NAME}  where ISDISABLE = 0 order by ${orderField}`
    );
  },

  allWithDescendingOrder(orderField) {
    return db.load(
      `select * from ${TABLE_NAME}  where ISDISABLE = 0 order by ${orderField} desc`
    );
  },

  //get all products by them category
  byCat(id) {
    return db.load(
      `select * from ${TABLE_NAME} where ID_CATE = ${id} and ISDISABLE = 0`
    );
  },

  async getSingle(id) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where ID_COURSE = ${id} `
    );
    if (rows.length === 0) return null;
    return rows[0];
  },
};
