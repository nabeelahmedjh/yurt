import mongoose from "mongoose";
import { Server, Space, User, Tag } from "../models/index.js";
import Pagination from "../utils/pagination.js";
import { ValidationError, ConflictError, NotFoundError, ForbiddenError, InternalServerError } from "../utils/customErrors.js";

const createServer = async (
  name,
  description,
  user,
  banner,
  serverImage,
  tags
) => {
  try {
    const serverExist = await Server.findOne({
      name: name 
    }).collation({ locale: "en", strength: 2 });
  
    if (serverExist) {
      throw new ConflictError("Server with this name already exist");
    }
  
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


  } catch (error) {
    if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Failed to create server');
    
  }

  
  };




const updateServer = async (
  userId,
  serverId,
  name,
  description,
  banner,
  serverImage,
  tags
) => {
  try {
  const isAdmin = await Server.findOne({admins: userId});
  if(!isAdmin){
    return { message : "Only admin can update the server."}
  }

  if (typeof tags === "string") {
    tags = JSON.parse(tags);
  }

 
  const updateData = {};
  
  if(name){
    const serverExist = await Server.findOne({
      name: name,
      _id: { $ne: serverId },
    }).collation({ locale: "en", strength: 2 });
  
    if (serverExist) {
      throw new ConflictError("Server wth this name already exists");
    }
    else{
      updateData.name = name;
    }
  }

  if(description){
    updateData.description = description;
  }

  if(banner){
    updateData.banner = banner;
  }

  if(serverImage){
    updateData.serverImage = serverImage;
  }

  if(tags){
    updateData.tags = tags;
  }



  
    const updatedServer = await Server.findByIdAndUpdate(serverId, {$set: updateData}, {new: true, runValidators: true}).populate("tags");
  
    if (!updatedServer) {
      return { message: 'Server not found' };
    }

    return updatedServer;

  } catch (error) {
    if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError) {
      throw error;
    }
    else if (error.name === "CastError") {
      throw new Error("Invalid user ID");
    } else if (error.name === "ValidationError") {
      throw new Error(`Validation failed: ${error.message}`);
    } else {
      throw error;
    }
  } 
};



const getJoinedServers = async (req, res) => {
  const user = req.user;
  const userId = user.user._id;
  const servers = await Server.aggregate([
    {
      $match: { members: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "spaces",
        localField: "spaces",
        foreignField: "_id",
        as: "spaces",
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags",
      },
    },
  ]);

  return servers;
};


const getAllServers = async (
  userId,
  servername,
  searchtype,
  tags,
  page,
  limit,
  offset
) => 
    {
  let tagNames = [];
  if (tags && tags.length > 0) {
    tagNames = tags.split(",");
  }
  try {
    let matchCondition;
if (searchtype === "strict") {
  matchCondition = {
    name: {
      $regex: `^${servername}$`, // 
      $options: "i",            
    },
  };
} else{
  matchCondition = {
    name: {
      $regex: servername,
      $options: "i",
    },
  };
}


  const servers = await Server.aggregate([
    {
      $match: matchCondition,
    },
    ...(tagNames.length > 0
      ? [
          {
            $lookup: {
              from: "tags",
              localField: "tags",
              foreignField: "_id",
              as: "tags",
            },
          },
          {
            $match: {
              "tag.name": { $all: tagNames },
            },
          },
        ]
      : []),
    {
      $addFields: {
        userJoined: {
          $in: [new mongoose.Types.ObjectId(userId), "$members"],
        },
      },
    },
    {
      $sort: {
        userJoined: 1,
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        banner: 1,
        userJoined: 1,
        tags: 1,
        membersCount: {
          $size: "$members",
        },
        _id: 1,
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags",
      },
    },
  ]);
  if(!servers.length > 0){
    throw new NotFoundError("Server not found")
  }
  return Pagination.paginateArray(page, limit, offset, servers);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('something went wrong');

  }


};

const getServerById = async (serverId) => {
  const server = await Server.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(serverId) },
    },
    {
      $lookup: {
        from: "spaces",
        localField: "spaces",
        foreignField: "_id",
        as: "spaces",
        pipeline: [
          {
            $addFields: {
              lowercaseName: { $toLower: "$name" },
            },
          },
          {
            $sort: {
              lowercaseName: 1,
            },
          },
          {
            $project: {
              lowercaseName: 0,
            },
          },
        ],
      },
    },
  ]);

  return server;
};

const createSpace = async (serverId, name, description, spaceImage, type) => {
  let newSpace;
  newSpace = await Space.create({
    name,
    description,
    spaceImage,
    server: serverId,
    type,
  });

  const server = await Server.findById(serverId);
  server.spaces.push(newSpace._id);
  await server.save();
  return newSpace;
};

const getMembersByServerId = async (serverId, page, limit, offset, type) => {
  // return response in pagination format
  if (type === "normal") {
    const server = await Server.findById(serverId).populate("members");
    return Pagination.paginateArray(page, limit, offset, server.members);
  } else if (type === "admin") {
    const server = await Server.findById(serverId).populate("admins");
    return Pagination.paginateArray(page, limit, offset, server.admins);
  }
};

export default {
  createServer,
  updateServer,
  getJoinedServers,
  getAllServers,
  getServerById,
  createSpace,
  getMembersByServerId,
};
