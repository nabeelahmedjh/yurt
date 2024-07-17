import mongoose from "mongoose";
import { Server, Space, User } from "../models/index.js";

const createServer = async (req, res) => {
  const user = req.user.user;
  console.log(user);
  const { name, description } = req.body;

  if (!name) {
    return res.json({
      status: 400,
      error: { message: "Name is required" },
    });
  }

  if (!description) {
    return res.json({
      status: 400,
      error: { message: "Description is required" },
    });
  }

  let newServer;
  try {
    newServer = await Server.create({
      name,
      description,
      admins: [user._id],
      members: [user._id],
    });
  } catch (error) {
    return res.json({
      status: 500,
      error: { message: error.message },
    })
  }

  try {
    const logedInUser = await User.findOne({ _id: user._id });
    console.log("model")
    logedInUser.serversJoined.push(newServer._id);
    await logedInUser.save();

  } catch (error) {
    return res.json({
      status: 500,
      error: { message: error.message },
    });
  }

  return res.json({
    status: 201,
    data: newServer,
  });
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

  if (!serverId) {
    return res.json({
      status: 400,
      error: { message: "ServerId is required" },
    });
  }

  if (!name) {
    return res.json({
      status: 400,
      error: { message: "Name is required" },
    });
  }

  if (!description) {
    return res.json({
      status: 400,
      error: { message: "Description is required" },
    });
  }

  let newSpace;
  try {
    newSpace = await Space.create({
      name,
      description,
      server: serverId,
    });

  } catch (error) {
    return res.json({
      status: 500,
      error: { message: error.message },
    });
  }

  try {
    const server = await Server.findById(serverId);
    server.spaces.push(newSpace._id);
    await server.save();
  } catch (error) {
    return res.json({
      status: 500,
      error: { message: error.message },
    });
  }

  return {
    status: 201,
    data: newSpace,
  };

};

export default {
  createServer,
  getServers,
  createSpace,
};
