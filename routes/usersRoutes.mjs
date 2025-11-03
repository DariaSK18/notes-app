import { Router } from "express";
import { users } from "../constants.mjs";

const router = Router()

router.get("/api/users", (request, response) => {
  response.send(users);
});
router.get("/api/users/:id", (request, response) => {
  const userId = request.params.id;
  //   if(!userId) return res.status(400).send({msg: 'Bad request. Invalid ID.'})
  // .send({msg: 'Bad request. Invalid ID.'})
  const foundUser = users.find((user) => user.id === userId);
  if (!foundUser) return response.sendStatus(404);
  console.log("foundUser", foundUser);
  response.send(foundUser);
});

export default router
