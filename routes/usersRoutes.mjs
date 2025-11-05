import { request, response, Router } from "express";
import { users } from "../constants.mjs";
import { resolveItemById, resolveIndexById } from "../utils/midlewares.mjs";
import { validationSchemaUser } from "../utils/validationShemas.mjs";
import { checkSchema, validationResult, matchedData } from "express-validator";
import passport from "passport";
import "../strategies/local-strategy.mjs";
import { User } from "../mongoose/schemas/user.mjs";

const router = Router();

router.get("/api/users", (request, response) => {
  // console.log(request.headers.cookie);
  // console.log(request.cookies);
  // console.log(request.signedCookies);
  // console.log(request.session);
  // console.log(request.sessionID);
  // request.sessionStore.get(request.session.id, (err, sessionData) => {
  //   if(err) {
  //     console.log(err)
  //     throw err
  //   }
  //   console.log(sessionData);
  // })
  // if (request.signedCookies.sessionId && request.signedCookies.sessionId === "world") return response.send(users);
  // else return response.status(403).send({msg: 'Wrong cookie'})
  if (request.session.user) return response.send(users);
  else return response.status(403).send({ msg: "Wrong cookie" });
});

router.get("/api/users/:id", resolveItemById(users), (request, response) => {
  const { item } = request;
  console.log("item", item);
  if (!item) return response.sendStatus(404);
  response.send(item);
});

router.post(
  "/api/users",
  checkSchema(validationSchemaUser),
  async (request, response) => {
    const result = validationResult(request);
    console.log(result);
    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });
    const data = matchedData(request);
    console.log(data);

    const newUser = new User(data)
    console.log(newUser);
    
    try {
      const savedUser = await newUser.save()
      return response.status(201).send(savedUser)
    }catch(err) {
      console.log(err)
      return response.sendStatus(400)
    }

    // const newUser = { id: crypto.randomUUID(), ...data };
    // // console.log(newUser);
    // users.push(newUser);
    // // console.log(users);
    // return response.status(201).send(newUser);
  }
);

router.patch("/api/users/:id", resolveIndexById(users), (request, response) => {
  const { body, findIndex } = request;
  users[findIndex] = { ...users[findIndex], ...body };
  return response.sendStatus(200);
});

router.delete(
  "/api/users/:id",
  resolveIndexById(users),
  (request, response) => {
    const { findIndex } = request;
    users.splice(findIndex, 1);
    return response.sendStatus(200);
  }
);

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

router.post(
  "/api/auth",
  passport.authenticate("local"),
  (request, response) => {
    response.sendStatus(200);
  }
);

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

router.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

export default router;
