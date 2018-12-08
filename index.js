// convention is that the root file in a node project is named index.js
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");
require("./models/user");
require("./services/passport");

mongoose.connect(keys.mongoURI);

// the app object is created by the express library
// middlewares and route handlers are the key things to understand in express
const app = express();

// .use is a middleware function. Middleware are functions that modify incoming requests in our app, before they are sent off to route handlers. Middlewares do pre-processing of requests before they are sent over to route handlers.
app.use(
  // cookieSession requires a configuration object with two props: a maxAge object, this tells the browser how long the cookie should persist for
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
