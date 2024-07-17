import mongoose from "mongoose";
import { Server, Space, User } from "../models/index.js";

const createServer = async (req, res) => {
  const user = req.user.user;
  console.log(user);
  const { name, description } = req.body;

  const newServer = await Server.create({
    name,
    description,
    admins: [user._id],
    members: [user._id],
  });

  const logedInUser = await User.findOne({ _id: user._id });
  console.log("model")
  logedInUser.serversJoined.push(newServer._id);
  await logedInUser.save();

  return newServer
};

const getServers = async (req, res) => {
  const user = req.user;
  const userId = user.user._id;

  const servers = await Server.aggregate([
    {
      $match:
        { members: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "spaces",
        localField: "spaces",
        foreignField: "_id",
        as: "spaces",
      }
    }
  ])
  return servers;
};

const createSpace = async (req, res) => {
  const { serverId } = req.params;
  const { name, description } = req.body;



  let newSpace;
  newSpace = await Space.create({
    name,
    description,
    server: serverId,
  });

  const server = await Server.findById(serverId);
  server.spaces.push(newSpace._id);
  await server.save();


  return newSpace;

};

export default {
  createServer,
  getServers,
  createSpace,
};
