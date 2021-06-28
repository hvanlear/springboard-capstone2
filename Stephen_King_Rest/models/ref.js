const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');

class Ref {
  static async create(handle) {
    const bookQuery = await db.query(
      `SELECT book_id
                FROM books
                WHERE handle = $1`,
      [handle]
    );
    const res = bookQuery.rows[0];
    console.log(res);
  }
}

Ref.create('it');

module.exports = Ref;
