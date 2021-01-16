const db = require("../utils/database");
const TABLE_NAME = "orderdetail";

module.exports = {
  all() {
    return db.load(`select * from ${TABLE_NAME}`);
  },

  allByUserId(id) {
    return db.load(`select * from ${TABLE_NAME} where ID_USER = ${id}`);
  },

  allByCourseId(id) {
    return db.load(`select * from ${TABLE_NAME} where ID_COURSE = ${id}`);
  },

  allByUserAndCourseId(id_user, id_course) {
    return db.load(
      `select * from ${TABLE_NAME} where ID_USER = ${id_user} and ID_COURSE=${id_course}`
    );
  },

  add(newObj) {
    return db.add(newObj, TABLE_NAME);
  },

  del(Obj) {
    const condition = { ID: Obj.ID };
    return db.del(condition, TABLE_NAME);
  },

  update(Obj) {
    const condition = { ID: Obj.ID };
    return db.update(Obj, condition, TABLE_NAME);
  },

  async getSingle(id) {
    const rows = await db.load(`select * from ${TABLE_NAME} where ID = ${id} `);
    if (rows.length === 0) return null;
    return rows[0];
  },
};
