//Routes for Books

const express = require("express");

const { BadRequestError } = require("../expressError");
const Book = require("../models/book");

const router = new express.Router();

router.get("/", async (req, res, next) => {
  try {
    const books = await Book.findAll();
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.get(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

// POST / {book} => {book}

//TODO add authentication and schema validation

router.post("/", async function (req, res, next) {
  try {
    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

router.post("/batch", async function (req, res, next) {
  try {
    var i = 0;
    while (i < req.body.length) {
      await Book.create(req.body[i]);
      i++;
    }

    return res.status(201).send(`Created ${i} records.`);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
