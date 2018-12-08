// keys.js - figure out what set of credentials to return

// when we deply our server to heroku, there is an existing environment variable called node env.
// This env var tells us whether or not we are running in a prod environment

if (process.env.NODE_ENV === "production") {
  // we are in production - return prod set of keys
  module.exports = require("./prod");
} else {
  // we are in dev - return dev set of keys
  module.exports = require("./dev");
}
