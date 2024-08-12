import mongoose from "mongoose";
import { Server, Space, User } from "../models/index.js";

const createServer = async (req, res) => {
  const user = req.user.user;
  console.log(user);
  const { name, description,banner} = req.body;

  const newServer = await Server.create({
    name,
    description,
    banner,
    admins: [user._id],
    members: [user._id],
  });

  const logedInUser = await User.findOne({ _id: user._id });
  console.log("model")
  logedInUser.serversJoined.push(newServer._id);
  
  await logedInUser.save();

  return newServer
};

const getJionedServers = async (req, res) => {
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

const getAllServers = async(userId, search) =>{


  const servers = await Server.aggregate([
  
    {
    $match:{
      name:{
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
        membersCount: {     
          $size: "$members"
        },
        _id: 1              
      }
    }
  ])
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
