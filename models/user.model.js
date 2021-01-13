const db = require("../utils/database");
const TABLE_NAME = "user";

module.exports = {
  all() {
    return db.load(`select * from ${TABLE_NAME}`);
  },

  //get all students or all teachers
  allByType(type) {
    return db.load(`select * from ${TABLE_NAME} where Type = ${type}`);
  },

  add(newObj) {
    return db.add(newObj, TABLE_NAME);
  },

  del(Obj) {
    // const condition = { ID: Obj.ID };
    return db.del(condition, TABLE_NAME);
  },

  update(Obj) {
    // const condition = { ID: Obj.ID };
    return db.update(Obj, condition, TABLE_NAME);
  },

  async getSingle(id) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where ID_USER = ${id} `
    );
    if (rows.length === 0) return null;
    return rows[0];
  },

  async getSingleByUsername(username) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where Username = "${username}" `
    );
    if (rows.length === 0) return null;
    return rows[0];
  },
};
