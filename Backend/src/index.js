import express from "express";
import path from "path";
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
import { instrument } from "@socket.io/admin-ui"
import passport from "passport";
import "./strategy/jwt-strategy.js";
import "./strategy/local-strategy.js";
import routes from "./routes/index.js";
import expressWs from 'express-ws';
import { makeOrLoadRoom } from './whiteboard/rooms.js';
import { routeErrorHandler } from "./utils/routeErrorHandler.js";
import jwt from "jsonwebtoken";
import helmet from "helmet";

const CORS_ORIGINS = process.env.CORS_ORIGINS.split(",") || [];



dbConnection();
const app = express();

// Disabling it for now, causing issues with some things.
// app.use(helmet());

const expressServer = http.createServer(app);
expressWs(app, expressServer); // Attach expressWs to both app and server

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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
app.use(cors({
  origin: CORS_ORIGINS,
  methods: '*',
  allowedHeaders: '*',
  credentials: true
}));

// WebSocket endpoint for whiteboard
app.ws('/whiteboard/:roomId', async (ws, req) => {
  console.log("Websocket connection established");
  const roomId = req.params.roomId;
  const sessionId = req.query.sessionId;

  try {
    const room = await makeOrLoadRoom(roomId);
    room.handleSocketConnect({ sessionId, socket: ws });
  } catch (error) {
    console.error('Error handling socket connection:', error);
    ws.close();
  }
});

// Regular routes
app.use("/", routes);
app.use(routeErrorHandler);
app.use("/uploads", express.static("./uploads"));
app.use("/public", express.static("./src/public"));



const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
expressServer.listen(EXPRESS_PORT, () => {
  const host = expressServer.address().address;
  const port = expressServer.address().port;
  console.log(`Express server Listening on http://${host}:${port}/`);
});


// ---------------- Socket.IO Server (Different Port) -------------------

const socketServer = http.createServer(); // New server for Socket.IO

const socketio = new Server({
  cors: {
    origin: CORS_ORIGINS,
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  },
  // transports: ['websocket']
});

instrument(socketio, {
  auth: false,
  mode: "development",
});


// Middleware to authenticate socket connections
socketio.use((socket, next) => {
  let token;

  if (socket.handshake.auth.token) {
    token = socket.handshake.auth.token;
  } 

  if(socket.handshake.headers.authorization) {
    token = socket.handshake.headers.authorization.split(' ')[1];
  }

  if(!token) {
    console.log(`Authentication error: No token provided for socket ${socket.id}`);
  }
  

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(`Authentication error: Invalid token for socket ${socket.id}`);
      return next(new Error('Authentication error: Invalid token'));
    }

    // Attach decoded data to the socket object, e.g., user information
    socket.user = decoded;
    console.log(`Socket with ID ${socket.id} authenticated successfully. User info:`, decoded);

    return next();
  });
});

global.io = socketio.listen(socketServer);
global.io.on("connection", WebSockets.connection);

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   const host = server.address().address;
//   const port = server.address().port;
//   console.log(`Listening on http://${host}:${port}/`);
// });

const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT || 4000;
socketServer.listen(SOCKET_IO_PORT, () => {
  console.log(`Socket.IO server listening on port ${SOCKET_IO_PORT}`);
});
