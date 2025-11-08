import { request, response, Router } from "express";
import {
  query,
  checkSchema,
  validationResult,
  matchedData,
} from "express-validator";
import {
  validationSchema,
  validationSchemaNotePatch,
} from "../utils/validationShemas.mjs";
import { Note } from "../mongoose/schemas/note.mjs";

const router = Router();

// --- find all user's notes ---
router.get("/api/notes", async (request, response) => {
  if (!request.user) return response.sendStatus(401);
  const notessList = await Note.find({ userId: request.user._id });
  return response.status(200).send(notessList ?? []);
});

router.get("/api/notes/:id", async (request, response) => {
  try {
    const {
      params: { id },
    } = request;
    if (!request.user) return response.sendStatus(401);
    const note = await Note.findById({_id: id});
    if (!note) return response.sendStatus(404);
    console.log(note);
    return response.status(200).send(note);
  } catch (error) {
    console.log(error);
    return response.status(500).send({ msg: "Server Error" });
  }
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
    console.log("data", data);
    const newNote = new Note({
      title: data.title,
      description: data.description,
      userId: request.user._id,
    });
    console.log("newNote", newNote);
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

// --- edit note by id with extra check for current user ---
router.patch(
  "/api/notes/:id",
  checkSchema(validationSchemaNotePatch),
  async (request, response) => {
    const {
      body,
      params: { id },
    } = request;
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });
    const data = matchedData(request);
    // notes[findIndex] = { ...notes[findIndex], ...body };
    if (!request.user) return response.sendStatus(401);
    try {
      const updatedNote = await Note.findOneAndUpdate(
        { _id: id, userId: request.user._id },
        data,
        {
          new: true,
        }
      );
      if (!updatedNote)
        return response.status(404).send({ msg: "Note not found" });
      response.status(200).send(updatedNote);
    } catch (error) {
      console.log(`Error: ${error}`);
      return response.sendStatus(400);
    }
    // return response.sendStatus(200);
  }
);

// --- delete note by id for current user ---
router.delete("/api/notes/:id", async (request, response) => {
  const {
    params: { id },
  } = request;
  if (!request.user) return response.sendStatus(401);
  try {
    await Note.findOneAndDelete({ _id: id, userId: request.user._id });
    response.send(200);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

export default router;
