import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";
import mongoose from "mongoose";
import { dbConnection } from "./config/dbConnection.js";
import bodyParser from "body-parser";
import http from "http";
import logger from "morgan";
import cors from "cors";
import WebSockets from "./sockets/sockets.js";
import { Server } from "socket.io";
import passport from "passport";
import "./strategy/jwt-strategy.js";
import "./strategy/local-strategy.js";

import routes from "./routes/index.js";

dbConnection();
const app = express();
const socketio = new Server();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "nabeel",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.post(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.json({
      message: "Valid token",
    });
  }
);

app.use("/", routes);

app.get("/", (req, res) => {
  if (req.session.authenticated) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  } else {
    res.sendFile(path.join(__dirname, "/public/login.html"));
  }
});

const server = http.createServer(app);
global.io = socketio.listen(server);
global.io.on("connection", WebSockets.connection);
server.listen(process.env.PORT || 3000);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(
    `Listening on port:: http://localhost:${process.env.PORT || 3000}/`
  );
});
