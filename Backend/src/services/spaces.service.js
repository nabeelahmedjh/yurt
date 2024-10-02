import { Server } from "../models/index.js";
import { Message } from "../models/index.js";
import Space from "../models/space.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import pagination from "../utils/pagination.js";
import { ValidationError, ConflictError, NotFoundError, ForbiddenError, InternalServerError } from "../utils/customErrors.js";
import fs from 'fs/promises';
import path from "path"





const createSpace = async (name, description, spaceImage, type) => {
  const space = await Space.create({
    name,
    description,
    spaceImage,
    type,
  });
  return space;
};

const updateSpace = async (spaceId, userId, name, description, spaceImage) => {
  
  try {
    
    const server = await Server.findOne({ spaces: spaceId });

    if (!server) {
      throw new NotFoundError("server not found");
    }
  

    const isAdmin = server.admins.includes(userId);
    
    if (!isAdmin) {
      throw new ForbiddenError("User is not the admin of the server");
    }

    const spaceData = {};

    if(name){
      spaceData.name = name
    }

    if(description){
      spaceData.description = description;
    }
    if(spaceImage){
      spaceData.spaceImage = spaceImage;
    }

    
    const updatedSpace = await Space.findByIdAndUpdate(spaceId, {$set: spaceData}, {new: true, runValidators: true} ) 
    return updatedSpace;

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
}


const getJoinedSpacesIds = async (userId) => {
  const servers = await Server.find({ members: userId });
  let spacesIds = [];
  servers.map((server) => {
    spacesIds = [...spacesIds, ...server.spaces];
  });
  return spacesIds;
};

const sendMessageInSpace = async (content, spaceId, sentBy, attachment) => {
  const newMessage = await Message.create({
    content: content,
    sentBy: sentBy,
    spaceId: spaceId,
    attachment: attachment,
  });

  const newMessageObj = newMessage.toObject();
  newMessageObj.sentBy = await User.findOne({_id : sentBy}).populate("interests");
  return newMessageObj;
};

const getAllMessageInSpace = async (spaceId, page, limit, offset) => {
  const messages = await Message.aggregate([
    {
      $match: {
        spaceId: new mongoose.Types.ObjectId(spaceId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sentBy",
        foreignField: "_id",
        as: "sentBy",

        pipeline: [
          {
            $lookup: {
              from: "tags",
              localField: "interests",
              foreignField: "_id",
              as: "interests",
            },
          },
          {
            $project: {
              _id: 1,
              username: 1,
              bio: 1,
              avatar: 1,
              verified: 1,
              interests: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$sentBy",
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return pagination.paginateArray(page, limit, offset, messages);
};


const deleteSpaceById = async (spaceId, userId) => {
  try {

    const space = await Space.findById(spaceId);
   
    if(!space){
      throw new NotFoundError("space does not exists")
    }
    const server = await Server.findOne({spaces : spaceId});
   
    if(!server){
      throw new NotFoundError("Space does not belong to any server"); 
    }
   
    
    if(!server.members.includes(userId)){
      throw new ForbiddenError("You are not authorized to delete this space")
    }
 

    const removedSpace = await Server.findByIdAndUpdate(server._id, {$pull: { spaces: spaceId }})
    console.log(removedSpace)
    const deletedSpace = await Space.findByIdAndDelete(spaceId);
    
    if (!deletedSpace) {
      throw new NotFoundError("Space not found in the database");
    }
    await Message.deleteMany({ spaceId: spaceId });


    const messagePath = path.join(process.cwd(), 'uploads', server._id.toString(), spaceId);
    try {
      await fs.rm(messagePath, { recursive: true, force: true });
    } catch (error) {
      console.error('Error deleting message files:', error);
      
    }
    await server.save();
    return server.populate([{path: "spaces"}, {path: "tags"}]);

  } catch (error) {
    if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Failed to delete space');
    
  }
}


//========================================================================================================================================================================


const messageChatBot = (message, spaceId) => {

  const userId = 
}










export default {
  getJoinedSpacesIds,
  sendMessageInSpace,
  getAllMessageInSpace,
  createSpace,
  updateSpace,
  deleteSpaceById,
  messageChatBot
};
