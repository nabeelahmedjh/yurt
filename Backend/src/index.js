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

let corsOptions = {
  origin: [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://inspiron.lan:3001",
    "*"
  ],
};

dbConnection();
const app = express();
const socketio = new Server({
  cors: {
    origin: "http://localhost:3001",
  },
});

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
app.use(cors(corsOptions));

app.use("/", routes);

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
