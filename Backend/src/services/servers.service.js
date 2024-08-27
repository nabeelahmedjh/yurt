import mongoose from "mongoose";
import { Server, Space, User, Tag} from "../models/index.js";
import Pagination from "../utils/pagination.js";

const createServer = async (name, description, user, banner, serverImage, tags) => {

  const newServer = await Server.create({
    name,
    description,
    banner,
    serverImage,
    admins: [user._id],
    members: [user._id],
    tags: tags,
  });

  const logedInUser = await User.findOne({ _id: user._id });
  logedInUser.serversJoined.push(newServer._id);
  await logedInUser.save();
  return await newServer.populate("tags");
};

const getJoinedServers = async (req, res) => {
  const user = req.user;
  const userId = user.user._id;
  const servers = await Server.aggregate([
    {
      $match:{ members: new mongoose.Types.ObjectId(userId)},
    },
    {
      $lookup: {
        from: "spaces",
        localField: "spaces",
        foreignField: "_id",
        as: "spaces"
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

  ])

  return servers;
};

const getAllServers = async (userId, search, tags, page, limit, offset) => {

  let tagNames = [];
  if (tags && tags.length > 0) {
    tagNames = tags.split(','); 
  }

  const servers = await Server.aggregate([
    {
      $match: {
        name: {
          $regex: search,
          '$options': "i"
        }

      }
    },
    ...(tagNames.length > 0 ? [
      {
        
        $lookup: {
          from: "tags",
          localField: "tags", 
          foreignField: "_id",
          as: "tag"
        }
      },
      {
        $match: {
          "tag.name": { $all: tagNames }
        }
      },
    ] : []),
    {
      $addFields: {

        userJoined: {
          $in: [new mongoose.Types.ObjectId(userId), "$members"]
        }
      }
    },
    {
      $sort: {
        userJoined: 1
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
  return Pagination.paginateArray(page, limit, offset, servers);
  
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
  getJoinedServers,
  getAllServers,
  createSpace,
  getMembersByServerId,
};
