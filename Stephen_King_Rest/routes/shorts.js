//Routes for Shorts

const express = require("express");

const { BadRequestError } = require("../expressError");
const Short = require("../models/short");

const router = new express.Router();

router.get("/", async (req, res, next) => {
  try {
    const shorts = await Short.findAll();
    return res.json({ shorts });
  } catch (err) {
    return next(err);
  }
});

//POST {short} => {short}

router.post("/", async function (req, res, next) {
  try {
    const short = await Short.create(req.body);
    return res.status(201).json({ short });
  } catch (err) {
    return next(err);
  }
});

router.post("/batch", async (req, res, next) => {
  try {
    var i = 0;
    while (i < req.body.length) {
      await Short.create(req.body[i]);
      i++;
    }
    return res.status(201).send(`Created ${i} records.`);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
