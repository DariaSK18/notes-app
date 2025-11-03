import { Router } from "express";
import {
  query,
  checkSchema,
  validationResult,
  matchedData,
} from "express-validator";
import { validationSchema } from "../utils/validationShemas.mjs";
import { notes } from "../constants.mjs";
import { resolveIndexById } from "../utils/midlewares.mjs";

const router = Router();

router.get(
  "/notes",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Empty")
    .isLength({ min: 2, max: 10 })
    .withMessage("Must be at least 2-10 chars"),
  (request, response) => {
    const result = validationResult(request);
    console.log("result", result);

    console.log(request.query);
    const {
      query: { filter, value },
    } = request;
    if (filter && value)
      return response.send(
        notes.filter((note) =>
          note[filter].toLocaleLowerCase().startsWith(value.toLocaleLowerCase())
        )
      );
    return response.send(notes);
  }
);
router.get("/notes/:id", resolveIndexById(notes), (request, response) => {
  const { findIndex } = request;
  response.send(notes[findIndex]);
});

router.post("/notes", checkSchema(validationSchema), (request, response) => {
  const result = validationResult(request);
  console.log("result", result);
  if (!result.isEmpty())
    return response.status(400).send({ errors: result.array() });
  //   console.log(request.body);
  const data = matchedData(request);
  // const { body } = request;
  const newNote = { id: crypto.randomUUID(), ...data };
  notes.push(newNote);
  return response.status(201).send(newNote);
});

router.put("/notes/:id", resolveIndexById(notes), (request, response) => {
  const { body, findIndex, params: {id} } = request;
    console.log(id);
  //   console.log(findNoteIndex);
  notes[findIndex] = { id: id, ...body };
  return response.sendStatus(200);
});

router.patch("/notes/:id", resolveIndexById(notes), (request, response) => {
  const { body, findIndex } = request;
  notes[findIndex] = { ...notes[findIndex], ...body };
  return response.sendStatus(200);
});

router.delete("/notes/:id", resolveIndexById(notes), (request, response) => {
  const { findIndex } = request;
  notes.splice(findIndex, 1);
  return response.sendStatus(200);
});

export default router;
