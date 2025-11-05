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
import { Note } from "../mongoose/schemas/note.mjs";

const router = Router();

router.get(
  "/api/notes",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Empty")
    .isLength({ min: 2, max: 10 })
    .withMessage("Must be at least 2-10 chars"),
  (request, response) => {
    // console.log(request.userNotes);

    if (!request.user) return response.sendStatus(401);
    const result = validationResult(request);
    // console.log("result", result);
    // console.log(request.query);
    const {
      query: { filter, value },
    } = request;
    if (filter && value)
      return response.send(
        notes.filter((note) =>
          note[filter].toLocaleLowerCase().startsWith(value.toLocaleLowerCase())
        )
      );
    // return response.send(notes);
    return response.send(request.session.userNotes ?? []);
  }
);

router.get("/api/notes/:id", resolveIndexById(notes), (request, response) => {
  const { findIndex } = request;
  response.send(notes[findIndex]);
});

// --- adding note to database conected to user ---
router.post(
  "/api/notes",
  checkSchema(validationSchema),
  async (request, response) => {
    console.log(request.user);
    if (!request.user) return response.sendStatus(401);
    const result = validationResult(request);
    console.log("result", result);
    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });
      console.log(request.body);
    const data = matchedData(request);
    console.log('data', data);
    const newNote = new Note({
      title: data.title,
      description: data.description,
      userId: request.user._id
    });
    console.log('newNote', newNote);
    // const { userNotes } = request.session;
    // if (!userNotes) return response.sendStatus(400);
    // userNotes.push(newNote);
    // const { body } = request;
    // else request.session.userNotes = [newNote];
    // console.log(request.session.userNotes);

    // return response.status(201).send(userNotes);
    try {
      const savedNote = await newNote.save();
      console.log(savedNote);
      return response.status(201).send(savedNote);
    } catch (error) {
      console.log(err);
      return response.sendStatus(400);
    }
  }
);

router.put("/api/notes/:id", resolveIndexById(notes), (request, response) => {
  const {
    body,
    findIndex,
    params: { id },
  } = request;
  console.log(id);
  //   console.log(findNoteIndex);
  notes[findIndex] = { id: id, ...body };
  return response.sendStatus(200);
});

router.patch("/api/notes/:id", resolveIndexById(notes), (request, response) => {
  const { body, findIndex } = request;
  notes[findIndex] = { ...notes[findIndex], ...body };
  return response.sendStatus(200);
});

router.delete(
  "/api/notes/:id",
  resolveIndexById(notes),
  (request, response) => {
    const { findIndex } = request;
    notes.splice(findIndex, 1);
    return response.sendStatus(200);
  }
);

export default router;
