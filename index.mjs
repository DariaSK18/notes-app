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

import express, { response } from "express";
import { users, notes } from "./constants.mjs";

// const express = require('express')
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

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

app.get("/notes", (request, response) => {
  response.send(notes);
});
app.get("/notes/:id", (request, response) => {
  const parsedId = parseInt(request.params.id);
  if (isNaN(parsedId))
    return response.status(400).send({ msg: "Bad request. Invalid ID." });
  const foundNote = notes.find(note => note.id === parsedId)
  if(!foundNote) return response.sendStatus(404)
  response.send(foundNote);
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
