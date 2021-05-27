const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Book {
  //create a book, update DB, return new Book Data
  //data should be {handle, title, pages, publisher, publish_year, isbn, notes}
  // throw error if book already exists

  static async create({ handle, title, pages, publisher, year, isbn, notes }) {
    const dublicateCheck = await db.query(
      `SELECT handle
            FROM books
            WHERE handle =  $1`,
      [handle]
    );
    if (dublicateCheck.rows[0])
      throw new BadRequestError(`Duplicate Book: ${handle}`);

    const result = await db.query(
      `INSERT INTO books 
        (year, title, handle, publisher, isbn, pages, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING year AS "publishYear", title, handle, publisher , isbn, pages, notes`,
      [year, title, handle, publisher, isbn, pages, notes]
    );
    const book = result.rows[0];

    return book;
  }

  static async findAll() {
    const rawbooks = await db.query(
      `SELECT
          b.book_id AS id, b.handle, b.title, b.pages, b.publisher, b.year, b.isbn, b.notes
        FROM books b
        `
    );

    const bookData = await Promise.all(
      rawbooks.rows.map(async ({ ...book }) => ({
        ...book,
        villains: await db.query(
          `
          SELECT v.villain_id AS id, v.name
          FROM book_villains bv
          JOIN villains v USING (villain_id)
          WHERE bv.book_id = ${book.id}
        `
        ),
        places: await db.query(
          `
          SElECT p.place_id AS id, p.name
          FROM book_places bp
          JOIN places p USING (place_id)
          WHERE bp.book_id = ${book.id}
          `
        ),
      }))
    );

    const books = bookData.map((book) => ({
      ...book,
      villains: book.villains.rows.map((villain) => ({
        id: villain.id,
        villainName: villain.name,
      })),
      places: book.places.rows.map((place) => ({
        id: place.id,
        placeName: place.name,
      })),
    }));

    return books;

    // for (let i = 0; i < bookData.length; i++) {
    //   console.log(bookData[i].villians.rows);
    // }
  }
}

module.exports = Book;
