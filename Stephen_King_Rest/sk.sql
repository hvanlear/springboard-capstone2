\echo 'Delete and recreate sk db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE stephen_king_rest;
CREATE DATABASE stephen_king_rest;
\connect stephen_king_rest

\i sk-schema.sql
-- \i sk-seed.sql