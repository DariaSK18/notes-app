import { Router } from "express";
// import { users } from "../constants.mjs";
// import { resolveItemById } from "../utils/midlewares.mjs";
import {
  validationSchemaUser,
  validationSchemaUserPatch,
} from "../utils/validationShemas.mjs";
import { checkSchema, validationResult, matchedData } from "express-validator";
import passport from "passport";
import "../strategies/local-strategy.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import bcrypt from "bcrypt";

const router = Router();

// router.get("/api/users", (request, response) => {
//   // console.log(request.headers.cookie);
//   // console.log(request.cookies);
//   // console.log(request.signedCookies);
//   // console.log(request.session);
//   // console.log(request.sessionID);
//   // request.sessionStore.get(request.session.id, (err, sessionData) => {
//   //   if(err) {
//   //     console.log(err)
//   //     throw err
//   //   }
//   //   console.log(sessionData);
//   // })
//   // if (request.signedCookies.sessionId && request.signedCookies.sessionId === "world") return response.send(users);
//   // else return response.status(403).send({msg: 'Wrong cookie'})
//   if (request.session.user) return response.send(users);
//   else return response.status(403).send({ msg: "Wrong cookie" });
// });

// router.get("/api/users/:id", resolveItemById(users), (request, response) => {
//   const { item } = request;
//   console.log("item", item);
//   if (!item) return response.sendStatus(404);
//   response.send(item);
// });

// --- user registration and saving to database ---
router.post(
  "/api/users",
  checkSchema(validationSchemaUser),
  async (request, response) => {
    const result = validationResult(request);
    console.log(result);
    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });
    const data = matchedData(request);
    // console.log('data', data);
    data.password = hashPassword(data.password);
    // console.log('hashed p data',data);
    const newUser = new User(data);
    // console.log(newUser);

    try {
      const savedUser = await newUser.save();
      return response.status(201).send(savedUser);
    } catch (err) {
      console.log(err);
      return response.sendStatus(400);
    }

    // const newUser = { id: crypto.randomUUID(), ...data };
    // // console.log(newUser);
    // users.push(newUser);
    // // console.log(users);
    // return response.status(201).send(newUser);
  }
);

// --- edit profile information (userName and password for now) ---
router.patch(
  "/api/users/me",
  checkSchema(validationSchemaUserPatch),
  async (request, response) => {
    const { body } = request;
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });
    const data = matchedData(request);
    data.password = hashPassword(data.password);
    // console.log(data, body.currentPsw);
    

    if (!request.user) return response.sendStatus(401);
    try {
      const user = await User.findById(request.user._id)
      // console.log(user);
      if(!user) return response.sendStatus(404)
      const isMatch = await bcrypt.compare( body.currentPsw, user.password)
    // console.log(isMatch);
    // console.log(body.currentPsw, user.password);
    
    if(!isMatch) return response.status(400).send({msg: 'Current password incorrect'})
      const updatedUser = await User.findByIdAndUpdate(request.user._id, data, {
        new: true,
      });
      response.status(200).send(updatedUser);
    } catch (error) {
      console.log(`Error: ${error}`);
      return response.sendStatus(400);
    }

    // const { body, findIndex } = request;
    // users[findIndex] = { ...users[findIndex], ...body };
    // return response.sendStatus(200);
  }
);

// --- delete user account (only owned) and logout ---
router.delete("/api/users/me", async (request, response) => {
  if (!request.user) return response.sendStatus(401);
  try {
    await User.findByIdAndDelete(request.user._id);
    request.logout((err) => {
      if (err) return response.sendStatus(400);
      response.sendStatus(200);
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

// router.post(
//   "/api/auth",
//   checkSchema(validationSchemaUser),
//   (request, response) => {
//     const {
//       body: { userName, password },
//     } = request;
//     const findUser = users.find((user) => user.userName === userName);
//     if (!findUser || findUser.password !== password)
//       return response.status(401).send({ msg: "Bad credentials" });
//     request.session.user = findUser;
//     return response.status(200).send(findUser);
//   }
// );

// --- user login ---
router.post(
  "/api/auth",
  passport.authenticate("local", {
    failureRedirect: '/login',
    successRedirect: '/',
  })
  // (request, response) => {
  //   response.sendStatus(200)
  // }
);

// --- user authentification check ---
router.get("/api/auth/status", (request, response) => {
  // return request.session.user
  //   ? response.status(200).send(request.session.user)
  //   : response.status(401).send({ msg: "Not Authenticated" });
  console.log(request.user);
  console.log(request.session);

  return request.user
    ? response.status(200).send(request.user)
    : response.status(401).send({ msg: "Not Authenticated" });
});

// --- user logout ---
router.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

export default router;
