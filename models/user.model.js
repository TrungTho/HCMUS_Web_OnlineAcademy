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

  disableUser(id) {
    return db.load(
      `update ${TABLE_NAME} set isdisable=not(isdisable) where id_user=${id}`
    );
  },

  add(newObj) {
    return db.add(newObj, TABLE_NAME);
  },

  del(Obj) {
    const condition = { ID_USER: Obj.ID_USER };
    return db.del(condition, TABLE_NAME);
  },

  update(Obj) {
    const condition = { ID_USER: Obj.ID_USER };
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
      `select * from ${TABLE_NAME} where USERNAME = "${username}" and ISDISABLE = 0`
    );
    if (rows.length === 0) return null;
    return rows[0];
  },

  async getSingleByEmail(email) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where EMAIL = "${email}" `
    );
    if (rows.length === 0) return null;
    return rows[0];
  },
};
