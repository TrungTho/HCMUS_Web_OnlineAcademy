const db = require("../utils/database");
const TABLE_NAME = "course";

module.exports = {
  all() {
    return db.load(`select * from ${TABLE_NAME} where ISDISABLE = 0`);
  },

  allByInstructorId(userid) {
    return db.load(
      `select * from ${TABLE_NAME} where ID_USER = ${userid} and ISDISABLE = 0`
    );
  },

  allWithAscendingCourseName(querystring) {
    return db.load(
      `select * from ${TABLE_NAME} where match (coursename, shortdes, description) against ('${querystring}') order by coursename`
    );
  },

  allWithDescendingCourseName(querystring) {
    return db.load(
      `select * from ${TABLE_NAME} where match (coursename, shortdes, description) against ('${querystring}') order by coursename desc`
    );
  },

  allWithAscendingPrice(querystring) {
    return db.load(
      `select * from ${TABLE_NAME} where match (coursename, shortdes, description) against ('${querystring}') order by price desc`
    );
  },

  allWithDescendingPrice(querystring) {
    return db.load(
      `select * from ${TABLE_NAME} where match (coursename, shortdes, description) against ('${querystring}') order by price`
    );
  },

  //fulltext search with query
  fulltextSearch(querystring) {
    return db.load(
      `select * from ${TABLE_NAME} where match (coursename, shortdes, description) against ('${querystring}')`
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
