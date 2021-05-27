
/* */
/* removing handle as ID - many short story titles are too
 */

-- CREATE TABLE books (
--  handle VARCHAR(25) PRIMARY KEY CHECK (handle = lower(handle)),
--  title TEXT UNIQUE NOT NULL,
--  pages INTEGER,
--  publisher TEXT,
--  year INTEGER,
--  isbn TEXT UNIQUE,
--  notes TEXT
-- );
CREATE TABLE books (
 book_id serial,
 handle VARCHAR(40),
 title VARCHAR(40) UNIQUE NOT NULL,
 pages INTEGER,
 publisher VARCHAR(40),
 year INTEGER,
 isbn VARCHAR(40) UNIQUE,
 notes VARCHAR(200),
 PRIMARY KEY (book_id)
);

CREATE TABLE types (
    type_id serial,
    name VARCHAR(40) UNIQUE NOT NULL,
    PRIMARY KEY (type_id)
);

CREATE TABLE villains (
    villain_id serial,
    types_id int NOT NULL,
    name VARCHAR(40) UNIQUE NOT NULL,
    gender VARCHAR(40),
    status VARCHAR(20),
    PRIMARY KEY (villain_id),
    FOREIGN KEY (types_id) REFERENCES types(type_id) ON DELETE CASCADE
);

CREATE TABLE book_villains (
  villain_id INTEGER
    REFERENCES villains ON DELETE CASCADE,
  book_id INTEGER
    REFERENCES books ON DELETE CASCADE,
  PRIMARY KEY (villain_id, book_id)
);

CREATE TABLE places (
    place_id serial PRIMARY KEY,
    name VARCHAR(40) UNIQUE NOT NULL
);

CREATE TABLE book_places (
  place_id INTEGER
    REFERENCES places ON DELETE CASCADE,
  book_id INTEGER
    REFERENCES books ON DELETE CASCADE,
  PRIMARY KEY (place_id, book_id)
);

/* 
Originally published links to publisher table

 */
-- CREATE TABLE short (
--     url
--     title TEXT(80),
--     type TEXT(40),


-- )



-- CREATE TABLE places (

-- )