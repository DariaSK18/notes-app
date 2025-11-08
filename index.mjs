import express, { request, response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { Note } from "./mongoose/schemas/note.mjs";
import { isAuth, isUser } from "./utils/midlewares.mjs";

const app = express();
const mongoUri = process.env.MONGO_URI || "mongodb://localhost/notes_app"

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

dotenv.config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60, // one hour
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.get("/", isUser, (request, response) => {
  response.render("index", { title: "Home" });
});
app.get("/login", isUser, (request, response) => {
  response.render("login", { title: "Login" });
});
app.get("/register", isUser, (request, response) => {
  response.render("register", { title: "Register" });
});
app.get("/create-note", isAuth, isUser, (request, response) => {
  if (!request.user) return response.redirect("/login");
  response.render("create-note", { title: "Create note", id: "" });
});
app.get("/create-note/:id", isAuth, isUser, (request, response) => {
  if (!request.user) return response.redirect("/login");
  const id = request.params.id;
  response.render("create-note", { title: "Edit Note", id });
});
app.get("/dashboard", isAuth, isUser, async (request, response) => {
  if (!request.user) return response.redirect("/login");
  try {
    const notes = await Note.find({ userId: request.user._id }).lean();
    console.log("notes", notes, request.user._id);
    response.render("dashboard", {
      title: "Dashboard",
      user: request.user,
      notes: notes,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send("Server Error");
  }
});
app.get("/profile", isAuth, isUser, (request, response) => {
  if (!request.user) return response.redirect("/login");
  response.render("profile", { title: "Profile" });
});
app.get("/change-psw", isAuth, isUser, (request, response) => {
  if (!request.user) return response.redirect("/login");
  response.render("change-psw", { title: "Change Password" });
});

const PORT = process.env.PORT || 3000;
const HOST = "localhost";

app.listen(PORT, () => {
  console.log(`Running on Port: ${PORT}\n http://${HOST}:${PORT}`);
});
