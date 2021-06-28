const db = require('../db');
const { BadRequestError } = require('../expressError');
/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 *   like { title: "title", pages: "pages" }
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {title: 'The Stand', pages: 1000} =>
 *   { setCols: '"title"=$1, "pages"=$2',
 *     values: ['The Stand', 1000] }
 *
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError('No data');

  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(', '),
    values: Object.values(dataToUpdate),
  };
}

function getVillainBookData(query) {
  const books = db.query(
    `
    SELECT b.book_id AS id, b.title
    FROM book_villains bv
    JOIN books b USING (book_id)
    WHERE bv.villain_id = ${query.id}
    `
  );
  return books;
}

function getVillainShortData(query) {
  const shorts = db.query(
    `
    SELECT s.short_id AS id, s.title
    FROM short_villains sv
    JOIN shorts s USING (short_id)
    WHERE sv.villain_id = ${query.id}
    `
  );
  return shorts;
}

module.exports = {
  sqlForPartialUpdate,
  getVillainBookData,
  getVillainShortData,
};
