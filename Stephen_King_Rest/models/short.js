const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

// {
//     "title": "",
//     "type": "",
//     "handle": "",
//     "originally published in": "",
//     "collected in": ",
//     "notes": [""],
//     "date": 1959
//   },

class Short {
  //create a book, update DB, return new Book Data
  static async create({
    title,
    type,
    handle,
    originallyPublishedIn,
    collectedIn,
    notes,
    date,
  }) {
    console.log(`NEW SHORT: ${title}`);
    const dublicateCheck = await db.query(
      `SELECT handle
              FROM shorts
              WHERE handle =  $1`,
      [handle]
    );
    if (dublicateCheck.rows[0])
      throw new BadRequestError(`Duplicate Short: ${handle}`);

    const result = await db.query(
      `INSERT INTO shorts
          (title, type, handle, originally_published_in, collected_in, notes, date)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING title, handle, originally_published_in AS originallyPublishedIn, collected_in AS collectedIn, notes, date`,
      [title, type, handle, originallyPublishedIn, collectedIn, notes, date]
    );
    const short = result.rows[0];
    return short;
  }

  static async findAll() {
    const rawshorts = await db.query(
      ` SELECT
            s.short_id AS id, s.title, s.type, s.handle, s.originally_published_in, s.collected_in, s.notes, s.date, s.updated_at, s.created_at 
          FROM shorts s
      `
    );

    const shortData = await Promise.all(
      rawshorts.rows.map(async ({ ...short }) => ({
        ...short,
        villains: await db.query(
          `
          SELECT v.villain_id AS id, v.name
          FROM short_villains sv
          JOIN villains v USING (villain_id)
          WHERE sv.short_id = ${short.id}
          `
        ),
      }))
    );

    const shorts = shortData.map((short) => ({
      id: short.id,
      handle: short.handle,
      title: short.title,
      type: short.type,
      originallyPublishedIn: short.originally_published_in,
      collectedIn: short.collected_in,
      notes: short.notes,
      year: short.date,
      villains: short.villains.rows.map((villain) => ({
        id: villain.id,
        villainName: villain.name,
      })),
      updated_at: short.updated_at,
      created_at: short.created_at,
    }));
    return shorts;
  }
}

module.exports = Short;
