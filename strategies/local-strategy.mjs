import passport from "passport";
import { Strategy } from "passport-local";
import { users } from "../constants.mjs";

passport.serializeUser((user, done) => {
    console.log('Inside serializeUser', user);
    
  done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    console.log('Inside deserializeUser', id);
    try {
        const findUser = users.find(user => user.id === id) 
        if (!findUser) throw new Error("User not found");
        console.log('Find user', findUser);
        done(null, findUser)
    } catch (error) {
        done(error, null)
    }
})

export default passport.use(
  new Strategy({usernameField: "userName"}, (userName, password, done) => {
    console.log(`userName: ${userName}, password: ${password}`);
    try {
      const findUser = users.find((user) => user.userName === userName);
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password)
        throw new Error("Invalid credentials");
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
