//Routes for Villains

const express = require('express');

const { BadRequestError } = require('../expressError');
const Villain = require('../models/villain');

const router = new express.Router();

router.get('/', async (req, res, next) => {
  const q = req.query;
  console.log(q);
  try {
    const villains = await Villain.findAll(q);
    return res.status(201).json({ villains });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const villain = await Villain.get(req.params.id);
    return res.json({ villain });
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const villain = await Villain.create(req.body);
    return res.status(201).json(villain);
  } catch (err) {
    return next(err);
  }
});

// PATCH [villainId]
// Data can include : {name, type_id, gender, status}
//TO DO Add admin Auth

router.patch('/:id', async (req, res, next) => {
  try {
    const villain = Villain.update(req.params.id, req.body);
    return res.json({ villain });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
