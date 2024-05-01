import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import passport from "passport";
import "dotenv/config";
import User from "../models/user.model.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new Strategy(jwtOptions, (jwt_payload, done) => {
    console.log(jwt_payload);
    return done(null, jwt_payload);
  })
);
