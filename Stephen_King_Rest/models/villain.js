const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Villain {
  //create villian, updateDB, return new bookdata
  //data should be  types_id, name, gender, status

  static async create({ types_id, name, gender, status }) {
    const duplicateCheck = await db.query(
      `SELECT name
                from villains
                WHERE name = $1`,
      [name]
    );
    if (duplicateCheck.rows[0])
      throw new BadRequestError(`duplicate villain: ${name}`);

    const result = await db.query(
      ` INSERT INTO villains
            (types_id, name, gender, status)
            VALUES ($1, $2, $3, $4)
            RETURNING types_id AS "type", name, gender, status`,
      [types_id, name, gender, status]
    );
    const villain = result.rows[0];
    return villain;
  }
}

module.exports = Villain;
