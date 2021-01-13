const db = require("../utils/database");
const TABLE_NAME = "user_course";

module.exports = {
  all() {
    return db.load(`select * from ${TABLE_NAME}`);
  },

  getFeedbackWithCourseID(id) {
    return db.load(`select * from ${TABLE_NAME} where ID_COURSE = ${id}`);
  },

  add(newObj) {
    return db.add(newObj, TABLE_NAME);
  },

  del(Obj) {
    const condition = { CatID: Obj.CatID };
    return db.del(condition, TABLE_NAME);
  },

  update(Obj) {
    const condition = { CatID: Obj.CatID };
    return db.update(Obj, condition, TABLE_NAME);
  },

  async getSingle(id) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where ID_USER_COURSE = ${id} `
    );
    if (rows.length === 0) return null;
    return rows[0];
  },
};
