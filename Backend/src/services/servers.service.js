import mongoose from "mongoose";
import { Server, Space, User, Tag} from "../models/index.js";
import Pagination from "../utils/pagination.js";

const createServer = async (name, description, user, banner, tags) => {

  const newServer = await Server.create({
    name,
    description,
    banner,
    admins: [user._id],
    members: [user._id],
    tags: tags,
  });

  const logedInUser = await User.findOne({ _id: user._id });
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

const getAllServers = async (userId, search, tags) => {



  
  // tags = tags.split(',')
  



  const tagId = tags.map(id => new mongoose.Types.ObjectId(id));

  


  const servers = await Server.aggregate([

    {
      $match: {
        name: {
          $regex: search,
          '$options': "i"
        }

      }
    },
    ...(tagId.length > 0 ? [{ $match: { tags: { $all: tagId } } }] : []),
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
    },
    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags"
      }
    }
  ]);

  return servers;
}

const createSpace = async (serverId, name, description, type) => {

  let newSpace;
  newSpace = await Space.create({
    name,
    description,
    server: serverId,
    type
  });

  const server = await Server.findById(serverId);
  server.spaces.push(newSpace._id);
  await server.save();
  return newSpace;

};


const getMembersByServerId =async (serverId, page, limit, offset, type) => {

  // return response in pagination format
  if (type === "normal") {
    const server = await Server.findById(serverId).populate("members");
    return Pagination.paginateArray(page, limit, offset, server.members);
  } else if (type === "admin") {
    const server = await Server.findById(serverId).populate("admins");
    return Pagination.paginateArray(page, limit, offset, server.admins);
  }
}


export default {
  createServer,
  getJionedServers,
  getAllServers,
  createSpace,
  getMembersByServerId,
};
