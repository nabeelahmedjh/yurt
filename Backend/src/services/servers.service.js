import mongoose from "mongoose";
import { Server, Space, User } from "../models/index.js";

const createServer = async (name, description, user, banner, tags) => {

  console.log("tags", tags)

  const newServer = await Server.create({
    name,
    description,
    banner,
    admins: [user._id],
    members: [user._id],
    tags: tags,
  });

  console.log("newServer", newServer)

  const logedInUser = await User.findOne({ _id: user._id });
  console.log("model")
  logedInUser.serversJoined.push(newServer._id);

  await logedInUser.save();

  return await newServer.populate("tags");
};

const getJionedServers = async (req, res) => {
  const user = req.user;
  const userId = user.user._id;
  const servers = await Server.find().populate(["tags", "spaces"]);
  return servers;
};

const getAllServers = async (userId, search) => {


  const servers = await Server.aggregate([

    {
      $match: {
        name: {
          $regex: search,
          '$options': "i"
        }
      }
    },
    {
      $addFields: {

        userJoined: {
          $in: [new mongoose.Types.ObjectId(userId), "$members"]
        }
      }
    },
    {
      $sort: {
        userJoined: -1
      }
    },
    {
      $project: {
        name: 1,
        description: 1,
        banner: 1,
        userJoined: 1,
        tags: 1,
        membersCount: {
          $size: "$members"
        },
        _id: 1
      }
    }
  ]).populate("tags");
  return servers;
}

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
  getJionedServers,
  getAllServers,
  createSpace,
};
