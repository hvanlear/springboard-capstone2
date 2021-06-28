const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');
const {
  sqlForPartialUpdate,
  getVillainBookData,
  getVillainShortData,
} = require('../helpers/sql');

/**
 * REFACTOR TODO
 * 1. Create Generic Villain Object for single GET and findAll()
 *
 */

class Villain {
  //create villian, updateDB, return new bookdata
  //data should be  types_id, name, gender, status

  static async create({
    types_id,
    name,
    appears_in,
    gender = 'Unknown',
    status,
  }) {
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
            (types_id, name, appears_in, gender, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING types_id AS "type", name, appears_in, gender, status`,
      [types_id, name, appears_in, gender, status]
    );
    const villain = result.rows[0];
    return villain;
  }

  //Find all villains
  static async findAll(searchFilters = {}) {
    const rawVillainAll = await db.query(
      `SELECT v.villain_id AS id, v.name, v.gender, v.status, types.type, types.type_id
      FROM villains v
      JOIN types ON v.types_id = types.type_id;`
    );

    const villainDataAll = await Promise.all(
      rawVillainAll.rows.map(async ({ ...villain }) => ({
        ...villain,
        books: await getVillainBookData(villain),
        shorts: await getVillainShortData(villain),
      }))
    );

    const villains = villainDataAll.map((villain) => {
      //if the villain is in a book, add the book row, if not then
      //add the short row
      const books = villain.books.rows;
      const shorts = villain.shorts.rows;
      const v = {
        id: villain.id,
        name: villain.name,
        gender: villain.gender,
        status: villain.status,
        type: { typeId: villain.type_id, type: villain.type },
        appearsIn: books.map((book) => ({
          id: book.id,
          type: 'book',
          title: book.title,
        })),
      };
      //if the villain also or only appears in a short-story
      if (shorts.length > 0) {
        for (let short of shorts) {
          v.appearsIn.push({
            id: short.id,
            type: 'short',
            title: short.title,
          });
        }
      }
      return v;
    });

    return villains;
  }

  /// get a single villain given id
  static async get(id) {
    const rawVillain = await db.query(
      `SELECT v.villain_id AS id, v.name, v.gender, v.status, types.type, types.type_id
      FROM villains v
      JOIN types ON v.types_id = types.type_id
      WHERE v.villain_id = $1`,
      [id]
    );

    if (!rawVillain.rows[0]) throw new NotFoundError(`No Villain Found`);

    const villainData = {
      ...rawVillain.rows[0],
      books: await getVillainBookData(rawVillain.rows[0]),
      shorts: await getVillainShortData(rawVillain.rows[0]),
    };

    const villain = (data) => {
      const v = {
        id: data.id,
        name: data.name,
        gender: data.gender,
        type: { typeId: data.type_id, type: data.type },
        status: data.status,
        appearsIn: data.books.rows.map((book) => ({
          id: book.id,
          title: book.title,
        })),
      };
      if (data.shorts.rows.length > 0) {
        for (let short of data.shorts.rows) {
          v.appearsIn.push({
            id: short.id,
            type: 'short',
            title: short.title,
          });
        }
      }
      return v;
    };

    return villain(villainData);
  }

  /** Update Villain with `data`
   *
   * This is a partial update - its fin if data doesnt contain all fields
   *  This only changes provided ones
   *
   * Data can include: {name,types_id, gender, status}
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = '$' + (values.length + 1);

    const querySql = `UPDATE villains
                      SET ${setCols}
                      WHERE villain_id  = ${idVarIdx}
                      RETURNING villain_id AS id,
                                name,
                                types_id AS typeId,
                                gender,
                                status`;
    const result = await db.query(querySql, [...values, id]);
    const villain = result.rows[0];

    if (!villain) throw new NotFoundError(`No Villain: ${id}`);
  }
}

module.exports = Villain;
