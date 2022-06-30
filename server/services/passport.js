const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

function createPassport(config, models) {
  const { clientID, clientSecret } = config;
  const { User } = models;

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        callbackURL: '/auth/google/callback',
        clientID,
        clientSecret,
        proxy: true
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ googleId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }
          const user = await new User({
            googleId: profile.id,
            displayName: profile.displayName
          }).save();
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  return passport;
}

module.exports = createPassport;
