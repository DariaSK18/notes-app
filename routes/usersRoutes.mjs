import { Router } from "express";
import { users } from "../constants.mjs";
import { resolveItemById, resolveIndexById } from "../utils/midlewares.mjs";
import { validationSchemaUser } from "../utils/validationShemas.mjs";
import { checkSchema, validationResult, matchedData } from "express-validator";

const router = Router();

router.get("/api/users", (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies);
  console.log(request.signedCookies);
  

  if (request.signedCookies.hello && request.signedCookies.hello === "world") return response.send(users);
  else return response.status(403).send({msg: 'Wrong cookie'})
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
  (request, response) => {
    const result = validationResult(request);
    // console.log(result);
    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });
    const data = matchedData(request);
    // console.log(data);
    const newUser = { id: crypto.randomUUID(), ...data };
    // console.log(newUser);
    users.push(newUser);
    // console.log(users);
    return response.status(201).send(newUser);
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

export default router;
