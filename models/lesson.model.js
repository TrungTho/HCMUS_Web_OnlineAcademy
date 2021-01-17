const db = require("../utils/database");
const TABLE_NAME = "detail";

module.exports = {
  all() {
    return db.load(`select * from ${TABLE_NAME}`);
  },

  allByCourseId(courseid) {
    return db.load(`select * from ${TABLE_NAME} where ID_COURSE = ${courseid}`);
  },

  allByCanPreview(reviewcode) {
    return db.load(`select * from ${TABLE_NAME} where REVIEW = ${reviewcode}`);
  },

  add(newObj) {
    return db.add(newObj, TABLE_NAME);
  },

  del(Obj) {
    const condition = { ID_DETAIL: Obj.ID_DETAIL };
    return db.del(condition, TABLE_NAME);
  },

  update(Obj) {
    const condition = { ID_DETAIL: Obj.ID_DETAIL };
    return db.update(Obj, condition, TABLE_NAME);
  },

  async getSingle(id) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where ID_DETAIL = ${id} `
    );
    if (rows.length === 0) return null;
    return rows[0];
  },
};
