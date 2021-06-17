const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Book {
  //data should be {handle, title, pages, publisher, year, isbn, notes}
  // throw error if book already exists

  static async create({ handle, Title, Pages, Publisher, Year, ISBN, Notes }) {
    console.log(`NEW BOOK: ${Title}`);
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
      [Year, Title, handle, Publisher, ISBN, Pages, Notes]
    );
    const book = result.rows[0];

    return book;
  }

  static async findAll() {
    const rawbooks = await db.query(
      `SELECT
          b.book_id AS id, b.handle, b.title, b.pages, b.publisher, b.year, b.isbn, b.notes, b.updated_at, b.created_at
        FROM books b`
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
      // ...book,
      id: book.id,
      handle: book.handle,
      title: book.title,
      pages: book.pages,
      publisher: book.publisher,
      year: book.year,
      isbn: book.isbn,
      notes: book.notes,
      villains: book.villains.rows.map((villain) => ({
        id: villain.id,
        villainName: villain.name,
      })),
      places: book.places.rows.map((place) => ({
        id: place.id,
        placeName: place.name,
      })),
      updated_at: book.updated_at,
      created_at: book.created_at,
    }));

    return books;

    // for (let i = 0; i < bookData.length; i++) {
    //   console.log(bookData[i].villians.rows);
    // }
  }

  //get a single book given ID

  static async get(id) {
    const rawbook = await db.query(
      `SELECT
      b.book_id AS id, b.handle, b.title, b.pages, b.publisher, b.year, b.isbn, b.notes, b.updated_at, b.created_at
      FROM books b
      WHERE b.book_id = $1`,
      [id]
    );

    if (!rawbook.rows[0]) throw new NotFoundError(`No Book Found`);

    const bookData = {
      ...rawbook.rows[0],
      villains: await db.query(
        `
        SELECT v.villain_id AS id, v.name
        FROM book_villains bv
        JOIN villains v USING (villain_id)
        WHERE bv.book_id = ${rawbook.rows[0].id}
      `
      ),
      places: await db.query(
        `
        SElECT p.place_id AS id, p.name
        FROM book_places bp
        JOIN places p USING (place_id)
        WHERE bp.book_id = ${rawbook.rows[0].id}
        `
      ),
    };
    const book = (data) => ({
      id: data.id,
      handle: data.handle,
      title: data.title,
      pages: data.pages,
      publisher: data.publisher,
      year: data.year,
      isbn: data.isbn,
      notes: data.notes,
      villains: data.villains.rows.map((villain) => ({
        id: villain.id,
        villainName: villain.name,
      })),
      places: data.places.rows.map((place) => ({
        id: place.id,
        placeName: place.name,
      })),
      updated_at: data.updated_at,
      created_at: data.created_at,
    });
    return book(bookData);
  }
}

module.exports = Book;
