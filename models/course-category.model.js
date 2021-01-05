require("../utils/database");
const TABLE_NAME = ""; //name of database

module.exports = {
  all() {
    return db.load(`select * from ${TABLE_NAME}`);
  },

  //   getAllCategoryWithCount() {
  //     return db.load(`select c.*, count(p.ProID) as ProductCount
  //     from categories c left join products p on c.CatID = p.CatID
  //     group by c.CatID, c.CatName`);
  //   },

  add(newObj) {
    return db.add(newObj, TABLE_NAME);
  },

  del(Obj) {
    //condition to delete field
    //const condition = { CatID: Obj.CatID };

    return db.del(condition, TABLE_NAME);
  },

  update(Obj) {
    //condition to update field
    // const condition = { CatID: Obj.CatID };
    return db.update(Obj, condition, TABLE_NAME);
  },

  async getSingle(id) {
    // const rows = await db.load(
    //   `select * from ${TABLE_NAME} where CatID = ${id} `
    // );

    if (rows.length === 0) return null;
    return rows[0];
  },
};
