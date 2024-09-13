import mongoose from "mongoose";
import path from "path";
import fs from "fs/promises";

import { Server, Space, User, Tag , InviteCode, Message } from "../models/index.js";
import Pagination from "../utils/pagination.js";
import { ValidationError, ConflictError, NotFoundError, ForbiddenError, InternalServerError } from "../utils/customErrors.js";

const createServer = async (
  name,
  description,
  user,
  isPublic,
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
      isPublic,
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
   
  const server = await Server.findById({ _id: serverId });

  if (!server) {
    throw new NotFoundError("server not found");
  }
  
  const isAdmin = server.admins.includes(userId);
  
  if (!isAdmin) {
    throw new ForbiddenError("User is not the admin of the server");
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
      $match: {
        ...matchCondition,
        isPublic: true,  
      },
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
  return Pagination.paginateArray(page, limit, offset, servers);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('something went wrong');
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
    {
      $lookup: {
      from: "tags",
      localField: "tags",
      foreignField: "_id",
      as: "tags",
      }
    },
  ]);

  return server;
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const joinPublicServer = async (serverId, userId) => {

  try {
    const server = await Server.findById(serverId);
    if (!server) {
      throw new NotFoundError('Server not found');
    }
    if (!server.isPublic) {
      throw new ValidationError('This server is private');
    }
    if (server.members.includes(userId)) {
      throw new ValidationError('You are already a member of this server');
    }
  
    server.members.push(userId);
    await server.save();

    await User.findByIdAndUpdate(userId, { $push: { serversJoined: server._id } });
    
    return server.populate([{path: "spaces"}, {path: "tags"}]);
  } catch (error) {

    if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Failed to join server'); 
  }
  
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



const leaveServer = async (serverId, userId) => {
  try {
    const server = await Server.findById(serverId);
    if (!server) {
      throw new NotFoundError('Server not found');
    }

    if (!server.members.includes(userId)) {
      throw new ValidationError('You are not a member of this server');
    }

    
    server.members = server.members.filter(memberId => memberId.toString() !== userId);
    await server.save();

    await User.findByIdAndUpdate(userId, { $pull: { serversJoined: server._id } });

    return server.populate([{path: "spaces"}, {path: "tags"}]);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Failed to leave server');
  }

}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const generateInviteCode = async (serverId, userId, expiresIn, usageLimit) => {
  try {
    const server = await Server.findById(serverId);
    if (!server) {
      throw new NotFoundError('Server not found');
    }
 
    if (!server.admins.includes(userId)) {
      throw new ForbiddenError('Only admins can generate invite links');
    }
 
    const code = await generateUniqueInviteCode();
    const expiresAt = new Date(Date.now() + expiresIn * 1000); 
    
    const newInviteCode = await InviteCode.create({
      server: serverId,
      code,
      expiresAt,
      usageLimit
    });
 
    server.inviteCodes.push(newInviteCode._id);
    await server.save();
 
    return newInviteCode;
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    console.error('Error in generateInviteCode:', error);
    throw new InternalServerError('Failed to generate invite code');
  }
};

async function generateUniqueInviteCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code;
  do {
    code = Array.from({length: 8}, () => characters[Math.floor(Math.random() * characters.length)]).join('');
  } while (await Server.findOne({ inviteCode: code }));
  return code;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const joinServerWithInviteCode = async (inviteCode, userId) => {
  try {
    const ExistingInviteCode = await InviteCode.findOne({ code : inviteCode });
    console.log(ExistingInviteCode)
    if (!ExistingInviteCode) {
      throw new ValidationError('Invalid invite code');
    }
    
    if (ExistingInviteCode.expiresAt < new Date()) {
      throw new ValidationError('Invite link has expired');
    }
    console.log(userId)
    if (ExistingInviteCode.usageCount >= ExistingInviteCode.usageLimit) {
      throw new ValidationError('Invite link usage limit reached');
    }
    
    const server = await Server.findById(ExistingInviteCode.server);
    if (!server) {
      throw new NotFoundError('Server not found');
    }
    console.log(server)
    if (server.members.includes(userId)) {
      throw new ValidationError('You are already a member of this server');
    }
    
    server.members.push(userId);

    ExistingInviteCode.usageCount += 1;
    
    await Promise.all([
      server.save(),
      ExistingInviteCode.save(),
      User.findByIdAndUpdate(userId, { $push: { serversJoined: server._id } })
    ]);
    
    return server.populate([{path: "spaces"}, {path: "tags"}]);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    console.error('Error in generateInviteCode:', error);
    throw new InternalServerError('Failed to generate invite code');
    
  }
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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


const deleteServerById = async (serverId, userId) => {
  try {
   
    const server = await Server.findById(serverId);
    if (!server) {
      throw new NotFoundError("Server not found");
    }

   
    if (!server.admins.includes(userId)) {
      throw new ForbiddenError("You are not authorized to delete this server");
    }

    
    for (const spaceId of server.spaces) {
      
      await Message.deleteMany({ spaceId });

      
      await Space.findByIdAndDelete(spaceId);

    
      const spacePath = path.join(process.cwd(), 'uploads', serverId, spaceId.toString());
      try {
        await fs.rm(spacePath, { recursive: true, force: true });
      } catch (error) {
        console.error(`Error deleting space files for space ${spaceId}:`, error);
        
      }
    }

   
    await InviteCode.deleteMany({ _id: { $in: server.inviteCodes } });

    
    await User.updateMany(
      { _id: { $in: server.members } },
      { $pull: { serversJoined: serverId } }
    );

    
    const serverPath = path.join(process.cwd(), 'uploads', serverId);
    try {
      await fs.rm(serverPath, { recursive: true, force: true });
    } catch (error) {
      console.error('Error deleting server directory:', error);
      
    }

    
    await Server.findByIdAndDelete(serverId);

    return { message: 'Server and all associated data deleted successfully' };
  } catch (error) {
    console.error('Error in deleteServerById:', error);
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    throw new InternalServerError('Failed to delete server');
  }
};







export default {
  createServer,
  updateServer,
  getJoinedServers,
  getAllServers,
  getServerById,
  createSpace,
  joinPublicServer,
  getMembersByServerId,
  leaveServer,
  generateInviteCode,
  joinServerWithInviteCode,
  deleteServerById,
};
