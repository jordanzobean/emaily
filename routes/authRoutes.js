const passport = require("passport");

// adding a route handler: In this route handler, we are going to tell express to use passport. Whenever a user visits the route specified, we want to kick them into the oAuth flow, which is being managed by passport. Use the google strategy typed as a string. The scope property tells google the information we want access to. In this case, the user's profile, and their email.
module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  app.get("/auth/google/callback", passport.authenticate("google"));

  app.get("/api/logout", (req, res) => {
    //   logout is a method that passport automatically attaches to the request object. Logout takes the cookie that contains the user id, and kills the user on the req object.
    req.logout();
    // req should no longer contain a user record after logout was called
    res.send(req.user);
  });

  //   this will test if a returning user has indeed gone through the oAuth process.
  app.get("/api/current_user", (req, res) => {
    res.send(req.session);
    // res.send(req.user);
  });
};
