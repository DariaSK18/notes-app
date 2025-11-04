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
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";

// const express = require('express')
const app = express();

dotenv.config()

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  secret: process.env.COOKIE_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60, // one hour
  }
}))

app.use(routes);

app.get("/", (request, response) => {
  // console.log(request.session);
  // console.log(request.sessionID);
  // request.session.visited = true
  // response.cookie("sessionId", "world", { maxAge: 60000, path: "/", signed: true });
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
