// console.log('hello')
// const os = require('os')
// let res = os.platform()
// console.log(res);
// const https = require('https')
// const fs = require('fs')

// const server = https.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
//     const stream = fs.createReadStream('index.ejs')
//     stream.pipe(res)
//     // res.end()
// })

// server.listen(PORT, HOST, () => {
//     console.log(`Server is running: https://${HOST}:${PORT}`);

// })

import express, { request, response } from "express";
import { users, notes } from "./constants.mjs";
import { query, validationResult } from "express-validator";

// const express = require('express')
const app = express();

app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// const loggingMidleware = (request, response, next) => {
//     console.log(`${request.method} - ${request.url}`)
//     next()
// }
// app.use(loggingMidleware)

const resolveIndexById = (array) => (request, response, next) => {
  const {
    params: { id },
  } = request;
  const findIndex = array.findIndex((item) => item.id === id);
  if (findIndex === -1) return response.sendStatus(400);
  request.findIndex = findIndex;
  next();
};

app.get("/", (request, response) => {
  response.render("index", { title: "Home" });
});
app.get("/login", (request, response) => {
  response.render("login", { title: "Login" });
});
app.get("/register", (request, response) => {
  response.render("register", { title: "Register" });
});
app.get("/api/users", (request, response) => {
  response.send(users);
});
app.get("/api/users/:id", (request, response) => {
  const userId = request.params.id;
  //   if(!userId) return res.status(400).send({msg: 'Bad request. Invalid ID.'})
  // .send({msg: 'Bad request. Invalid ID.'})
  const foundUser = users.find((user) => user.id === userId);
  if (!foundUser) return response.sendStatus(404);
  console.log("foundUser", foundUser);
  response.send(foundUser);
});

app.get(
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
app.get("/notes/:id", resolveIndexById(notes), (request, response) => {
  const parsedId = parseInt(request.params.id);
  if (isNaN(parsedId))
    return response.status(400).send({ msg: "Bad request. Invalid ID." });
  const foundNote = notes.find((note) => note.id === parsedId);
  if (!foundNote) return response.sendStatus(404);
  response.send(foundNote);
});

app.post("/notes", (request, response) => {
  //   console.log(request.body);
  const { body } = request;
  const newNote = { id: crypto.randomUUID(), ...body };
  notes.push(newNote);
  return response.status(201).send(newNote);
});

app.put("/notes/:id", resolveIndexById(notes), (request, response) => {
  const { body, findIndex } = request;
  //   console.log(id);
  //   console.log(findNoteIndex);
  notes[findIndex] = { id: id, ...body };
  return response.sendStatus(200);
});

app.patch("/notes/:id", resolveIndexById(notes), (request, response) => {
  const { body, findIndex } = request;
  notes[findIndex] = { ...notes[findIndex], ...body };
  return response.sendStatus(200);
});

app.delete("/notes/:id", resolveIndexById(notes), (request, response) => {
  const { findIndex } = request;
  notes.splice(findIndex, 1);
  return response.sendStatus(200);
});

app.post("/register", (request, response) => {
  const test = request.body.test;
  console.log(request.body, request.body.test);
  if (test === "") return response.redirect("login");
  else return response.redirect("/");
});

const PORT = process.env.PORT || 3000;
const HOST = "localhost";

app.listen(PORT, () => {
  console.log(`Running on Port: ${PORT}\n http://${HOST}:${PORT}`);
});
