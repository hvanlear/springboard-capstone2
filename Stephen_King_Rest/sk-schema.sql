
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
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE books (
 book_id serial,
 handle text,
 title text UNIQUE NOT NULL,
 pages INTEGER,
 publisher text,
 year INTEGER,
 isbn text UNIQUE,
 notes TEXT [],
 PRIMARY KEY (book_id),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE shorts (
  short_id serial,
  title text UNIQUE NOT NULL,
  type text,
  handle text,
  originally_published_in text,
  collected_in text,
  notes text [],
  date integer,
  PRIMARY KEY (short_id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON shorts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE types (
    type_id serial,
    type text UNIQUE NOT NULL,
    PRIMARY KEY (type_id)
);

CREATE TABLE villains (
    villain_id serial,
    types_id int NOT NULL,
    name text UNIQUE NOT NULL,
    appears_in text [],
    gender text,
    status VARCHAR(20),
    PRIMARY KEY (villain_id),
    FOREIGN KEY (types_id ) REFERENCES types(type_id ) ON DELETE CASCADE  
);

CREATE TABLE book_villains (
  villain_id INTEGER
    REFERENCES villains ON DELETE CASCADE,
  book_id INTEGER
    REFERENCES books ON DELETE CASCADE,
  PRIMARY KEY (villain_id, book_id)
);

CREATE TABLE short_villains (
  villain_id INTEGER
    REFERENCES villains ON DELETE CASCADE,
  short_id INTEGER
    REFERENCES shorts ON DELETE CASCADE,
  PRIMARY KEY (villain_id, short_id)
);

CREATE TABLE places (
    place_id serial PRIMARY KEY,
    name text UNIQUE NOT NULL
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