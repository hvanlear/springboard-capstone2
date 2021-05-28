//Routes for Villains

const express = require("express");

const { BadRequestError } = require("../expressError");
const Villain = require("../models/villain");

const router = new express.Router();

router.post("/", async (req, res, next) => {
  try {
    const villain = await Villain.create(req.body);
    return res.status(201).json(villain);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
