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
// import { users, notes } from "./constants.mjs";
// import {
//   query,
//   validationResult,
//   body,
//   matchedData,
//   checkSchema,
// } from "express-validator";
// import { validationSchema } from "./utils/validationShemas.mjs";
import routes from './routes/index.mjs'


// const express = require('express')
const app = express();

app.use(express.json());
app.use(routes)

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
