"use strict";

const app = require("./app");
const { PORT } = require("./config");

app.listen(PORT, () => {
  console.log(`started server on http://localhost:${PORT} `);
});
