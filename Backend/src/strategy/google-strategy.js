import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/user.model.js'
import { generatePassword } from '../utils/generate-pass.utils.js';
import "dotenv/config";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, cb) => {
        const user = await User.findOne({ googleId: profile.id });

        if (user) {
            console.log(user)
            return cb(null, user);

        } else {
            console.log("=====HERE=====")
            const newUser = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                password: await generatePassword("12312"),
                verified: true,
            });

            console.log(newUser)
            await newUser.save();
            return cb(null, newUser);
        }
    }

));

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})