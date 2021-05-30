INSERT INTO books 
    (handle, title, pages, publisher, year, isbn, notes)
VALUES
    ('it', 'It', 799, 'DoubleDay', 1975, '123445-25235', ARRAY['NOTE 1', 'NOTE 2']),
    ('the-stand', 'The Stand', 888, 'DoubleDay', 1980,'12345566-123', ARRAY['NOTE 1', 'NOTE 2']),
    ('the-gunslinger', 'The Gunslinger', 334, 'Viking', 1965, '145678', ARRAY['NOTE 1', 'NOTE 2']);

INSERT INTO types 
    (name)
VALUES
    ('Humanoid'),
    ('Vampire'),
    ('Creature'),
    ('Alien'),
    ('Animal');

INSERT INTO villains
    (types_id, name, gender, status)
VALUES
    (4, 'Penny Wise', 'Unknown', 'deceased'),
    (1, 'Randall Flag', 'Unknown', 'Unknown'),
    (1, 'Henery Bowers', 'Male', 'Deceased');

INSERT INTO book_villains
    (villain_id, book_id)
VALUES
    (1,1),
    (2,2),
    (2,3),
    (3,1);

INSERT INTO places
    (name)
VALUES
    ('Derry, Maine'),
    ('Las Vegas, Nevada'),
    ('Boulder, Colorado');

INSERT INTO book_places
    (place_id, book_id)
VALUES
    (1, 1),
    (2,2),
    (3,2);


