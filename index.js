// convention is that the root file in a node project is named index.js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send({
    hi: "there"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
