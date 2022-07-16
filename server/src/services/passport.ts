import { Logger } from "pino"
import passport from "passport"
import { Strategy } from "passport-google-oauth20"

import { Models } from "../models"
import { ServerConfig } from "../config"

function createPassport(config: ServerConfig, models: Models, logger: Logger) {
  const { clientID, clientSecret } = config
  const { User } = models

  logger.trace("Setting up passport user serialization/deserialization handlers")

  passport.serializeUser((user: any, done: any) => {
    done(null, user.id)
  })

  passport.deserializeUser((id: string, done: any) => {
    User.findById(id).then((user: any) => {
      done(null, user)
    })
  })

  logger.trace("Setting up passport auth strategy")

  const strategyConfig = {
    clientID,
    clientSecret,
    proxy: true,
    callbackURL: "/auth/google/callback"
  }

  logger.trace(strategyConfig)

  passport.use(
    new Strategy(
      strategyConfig,
      async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
        try {
          const existingUser = await User.findOne({ googleId: profile.id })
          if (existingUser) {
            return done(null, existingUser)
          }
          const user = await new User({
            googleId: profile.id,
            displayName: profile.displayName
          }).save()
          return done(null, user)
        } catch (err) {
          return done(err, null)
        }
      }
    )
  )

  return passport
}

export default createPassport
