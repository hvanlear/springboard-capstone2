const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const bookRoutes = require("./routes/books");
const villainRoutes = require("./routes/villains");
const shortRoutes = require("./routes/shorts");

const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.use("/books", bookRoutes);
app.use("/villains", villainRoutes);
app.use("/shorts", shortRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
