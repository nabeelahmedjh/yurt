import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User, Space } from "../models/index.js";
import { generatePassword } from '../utils/generate-pass.utils.js';
import "dotenv/config";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, cb) => {
        const email = profile.emails[0].value;
        const user = await User.findOne({ googleId: profile.id });

        if (user) {
            console.log(user)
            return cb(null, user);

        } else {
            console.log("=====HERE=====")
            const botSpace = await Space.create({name: email, type: "BOT", description: `This is LLM bot convo Space for user ${email}`});
            const newUser = await User.create({
                googleId: profile.id,
                email: email,
                password: await generatePassword("12312"),
                verified: true,
                botSpace: botSpace._id
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