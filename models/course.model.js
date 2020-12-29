const db = require("../utils/database");
const TABLE_NAME = "courses";

module.exports = {
  all() {
    return db.load(`select * from ${TABLE_NAME}`);
  },

  allWithAscendingOrder(orderField) {
    return db.load(`select * from ${TABLE_NAME} order by ${orderField}`);
  },

  allWithDescendingOrder(orderField) {
    return db.load(`select * from ${TABLE_NAME} order by ${orderField} desc`);
  },

  //get all products by them category
  byCat(id) {
    return db.load(`select * from ${TABLE_NAME} where ID = ${id}`);
  },

  async getSingle(id) {
    const rows = await db.load(`select * from ${TABLE_NAME} where ID = ${id} `);
    if (rows.length === 0) return null;
    return rows[0];
  },
};