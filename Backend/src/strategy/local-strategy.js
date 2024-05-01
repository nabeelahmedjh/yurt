import passport from "passport";
import { Strategy } from "passport-local";
import UserModel from "../models/user.model.js";

// export default passport.use(
//   "signup",
//   new Strategy(
//     { usernameField: "username" },
//     async (username, password, done) => {
//       console.log("username", username);
//       console.log("password", password);
//       try {
//         const user = await User.findOne({ username });
//         if (!user) {
//           return done(null, false, { message: "User not found" });
//         }

//         if (user.password !== password) {
//           return done(null, false, { message: "Password is incorrect" });
//         }

//         return done(null, user);
//       } catch (error) {
//         console.log(error);
//         done(error, null);
//       }
//     }
//   )
// );

// passport.use(
//   "signup",
//   new Strategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     async (email, password, done) => {
//       try {
//         const user = await UserModel.create({email, password });

//         return done(null, user);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

passport.use(
  "login",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        // const validate = await user.isValidPassword(password);

        if (user.password !== password) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
