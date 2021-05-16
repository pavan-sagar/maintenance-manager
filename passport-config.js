const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, users) {
  const authenticateUser = (email, password, done) => {
    users.findOne({ email }, async (err, user) => {
      if (user == null) {
        return done(null, false, { message: "No user with that email" });
      }

      try {
        if (await bcrypt.compare(password, user.password)) {
          console.log("Password matching");
          return done(null, user);
        } else {
          return done(null, false, { message: "Password incorrect" });
        }
      } catch (e) {
        return done(e);
      }
    });
  };

  const getUserById = async (id) => {
    await users.findById(id, (err, user) => {
      if (user) {
        return user;
      } else {
        return null;
      }
    });
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
