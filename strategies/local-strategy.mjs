import passport from "passport";
import { Strategy } from "passport-local";
import { users } from "../constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { compareHashedPassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  console.log("Inside serializeUser", user);

  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  // console.log('Inside deserializeUser', id);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User not found");
    console.log("Find user", findUser);
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(
    { usernameField: "userName" },
    async (userName, password, done) => {
      // console.log(`userName: ${userName}, password: ${password}`);
      try {
        const findUser = await User.findOne({ userName });
        // const findUser = users.find((user) => user.userName === userName);
        if (!findUser) throw new Error("User not found");
        if (!compareHashedPassword(password, findUser.password))
          throw new Error("Invalid credentials");
        done(null, findUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
