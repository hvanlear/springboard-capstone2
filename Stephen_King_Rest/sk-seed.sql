INSERT INTO books 
    (handle, title, pages, publisher, year, isbn, notes)
VALUES
    ('it', 'It', 799, 'DoubleDay', 1975, '123445-25235', ARRAY['NOTE 1', 'NOTE 2']),
    ('the-stand', 'The Stand', 888, 'DoubleDay', 1980,'12345566-123', ARRAY['NOTE 1', 'NOTE 2']),
    ('the-gunslinger', 'The Gunslinger', 334, 'Viking', 1965, '145678', ARRAY['NOTE 1', 'NOTE 2']);

INSERT INTO shorts
    (title, type, handle, originally_published_in, collected_in, notes, date)
VALUES
    ('Jumper', 'short-story', 'jumper', 'daves rag (1959)', 'secret windows (2000)', ARRAY['Self-Pub'], 1959);

INSERT INTO types 
    (type)
VALUES
    ('Humans'),
    ('Vampires'),
    ('Creatures'),
    ('Aliens'),
    ('Groups'),
    ('Vehicles'),
    ('Ghosts'),
    ('Animals');

INSERT INTO villains
    (types_id, name, appears_in, gender, status)
VALUES
    (4, 'Penny Wise', ARRAY['it'], 'Unknown', 'deceased'),
    (1, 'Randall Flag', ARRAY['the-stand', 'the-gunslinger'], 'Unknown', 'Unknown'),
    (1, 'Henery Bowers', ARRAY['it'], 'Male', 'Deceased'),
    (1, 'Short Villain', ARRAY['jumper'], 'Male', 'Deceased');

INSERT INTO book_villains
    (villain_id, book_id)
VALUES
    (1,1),
    (2,2),
    (2,3),
    (3,1);

INSERT INTO short_villains
    (villain_id, short_id)
VALUES
    (4,1),
    (2,1);

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


