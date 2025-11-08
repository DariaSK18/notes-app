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

// --- user registration and saving to database ---
router.post(
  "/api/users",
  checkSchema(validationSchemaUser),
  async (request, response) => {
    const result = validationResult(request);
    console.log(result);
    if (!result.isEmpty())
      return response.status(400).json({ errors: result.array() });
    const data = matchedData(request);
    // console.log('data', data);
    data.password = hashPassword(data.password);
    // console.log('hashed p data',data);
    const newUser = new User(data);
    // console.log(newUser);

    try {
      const savedUser = await newUser.save();
      return response.status(201).json(savedUser);
    } catch (err) {
      console.log(err);
      return response.status(400).json({msg: "Bad request"});
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
      const user = await User.findById(request.user._id);
      // console.log(user);
      if (!user) return response.sendStatus(404);
      const isMatch = await bcrypt.compare(body.currentPsw, user.password);
      // console.log(isMatch);
      // console.log(body.currentPsw, user.password);

      if (!isMatch)
        return response.status(400).send({ msg: "Current password incorrect" });
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

// --- user login ---
router.post(
  "/api/auth",
  (request, response, next) => {
    passport.authenticate("local", (err, user) => {
      console.log(user);

      if (err) {
        console.log(err);
        return response.status(500).send({ msg: "Server error" });
      }
      if (!user)
        return response.status(401).send({ msg: "Invalid credentials" });
      request.logIn(user, (err) => {
        if (err) return next(err);
        return response.send({ msg: "Successfully loged in" });
      });
    })(request, response, next)
    // response.status(200)
  }
  // passport.authenticate(
  //   "local",
  //   // {
  //   //   failureRedirect: "/login",
  //   //   successRedirect: "/",
  //   // }
  // )
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
