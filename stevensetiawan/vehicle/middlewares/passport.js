'use strict';
const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')

// Setup work and export for the JWT passport strategy
passport.serializeUser((req, user, done) => {
  done(null, user)
})

passport.deserializeUser((req, user, done) => {
  done(null, user)
})

passport.use(
  new JWTstrategy({
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        let expiration_date = new Date(token.exp * 1000)
        if (expiration_date < new Date()) {
          return done(null, false)
        }
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
)