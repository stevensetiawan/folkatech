'use strict';
const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const axios = require('axios')
const redis_connector = require('../helpers/redis_connector')

const authInstance = axios.create({
  baseURL: 'http://localhost:3002/api/v1/user',
  timeout: 1000,
});

// Setup work and export for the JWT passport strategy
passport.serializeUser((req, user, done) => {
  done(null, user)
})

passport.deserializeUser((req, user, done) => {
  done(null, user)
})

passport.use(
  'signup',
  new localStrategy({
      usernameField: 'emailAddress',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const {data} = await authInstance.post(
          "/signup",
          {
            emailAddress: email,
            password,
            accountNumber: req.body.accountNumber,
            identityNumber: req.body.identityNumber,
            userName: req.body.userName
          }
        );
        return done(null, data.token)
      } catch (error) {
        done(error);
      }
    }
  )
)

passport.use(
  'login',
  new localStrategy({
    usernameField: 'emailAddress',
    passwordField: 'password',    
  },
    async (email, password, done) => {
      try {
        const {data} = await authInstance.post(
          "/login",
          {
            emailAddress: email, 
            password
          }
        );

        return done(null, data.token, {
          message: 'Logged in Successfully'
        })

      } catch (error) {
        return done(error);
      }
    }
  )
)

exports.register = async (req, res, next) => {
  passport.authenticate(
    'signup', async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error('An error occurred.')
          return next(error)
        }

        req.login(
          user, {
            session: true
          },
          async (error) => {
            if (error) return next(error)
            const body = {
              id: user.id,
              email: user.emailAddress,
              identityNumber: user.identityNumber,
              accountNumber: user.accountNumber
            }
            const token = await jwt.sign({
              user: body
            }, process.env.SECRET, {
              expiresIn: 60000
            })

            await redis_connector.set('token', token, 600000)

            return res.json({
              token
            })
          }
        )
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next)
}

exports.auth = async (req, res, next) => {
  passport.authenticate(
    'login',
    async (err, user, info) => {
      try {
        if (err || !user) {
          if(err === null || !user){
            const error = new Error('User not found');

            return next(error.message);
          } else {
            const error = new Error('Error occured');

            return next(error.message);
          }
          
        }

        req.login(
          user, {
            session: true
          },
          async (error) => {
            if (error) return next(error);

            const body = {
              id: user.id,
              email: user.emailAddress,
              identityNumber: user.identityNumber,
              accountNumber: user.accountNumber
            }
            const token = await jwt.sign({
              user: body
            }, process.env.SECRET, {
              expiresIn: 600000
            });

            await redis_connector.set('token', token, 600000)

            return res.json({
              token
            })
          }
        );
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next)
}

passport.use(
  new JWTstrategy({
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        let expiration_date = new Date(token.exp * 1000000)
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