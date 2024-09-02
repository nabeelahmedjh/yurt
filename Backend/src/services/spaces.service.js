import { Server } from "../models/index.js";
import { Message } from "../models/index.js";
import Space from "../models/space.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import pagination from "../utils/pagination.js";

const createSpace = async (name, description, spaceImage, type) => {
  const space = await Space.create({
    name,
    description,
    spaceImage,
    type,
  });
  return space;
};

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
  newMessageObj.sentBy = await User.findOne({_id : sentBy})
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

export default {
  getJoinedSpacesIds,
  sendMessageInSpace,
  getAllMessageInSpace,
  createSpace,
};
