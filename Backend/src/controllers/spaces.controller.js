import Space from "../models/space.model.js";
import Message from "../models/message.model.js";
import mongoose, { get } from "mongoose";
import spacesService from "../services/spaces.service.js";
import botService from "../services/bot.service.js";
import spacesController from "./spaces.controller.js";
import path from 'path';

const createSpace = async (req, res) => {
  const { name, description, type } = req.body;

  const spaceImage = req.file
    ? {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        source: req.file.path.split(path.sep).join('/'),
      }
    : null;

  if (!name) {
    return res.status(400).json({
      error: { message: "Name is required" },
    });
  }

  if (!description) {
    return res.status(400).json({
      error: { message: "Description is required" },
    });
  }

  try {
    const newSpace = await spacesService.createSpace(
      name,
      description,
      spaceImage,
      type
    );
    return res.status(201).json({
      data: newSpace,
    });
  } catch (error) {
    res.status(500).json({
      error: { message: error.message },
    });
  }
};


const updateSpace = async (req, res, next) => {
  const { spaceId } = req.params;
  const { name, description } = req.body;
  const userId = req.user.user._id

  const spaceImage = req.file
    ? {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        source: req.file.path.split(path.sep).join('/'),
      }
    : null;

  try {
    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
      return res.status(400).json({
        error: {
          message: "Invalid server id",
        },
      });
    }



    const updatedSpace = await spacesService.updateSpace(spaceId, userId, name, description, spaceImage);
    
    return res.status(200).json({
      data: updatedSpace,
    });
  } catch (error) {
    next(error) 
  }
}



const sendMessageInSpace = async (req, res) => {
  const { content } = req.body;
  const { spaceId } = req.params;

  const attachment = req.files
    ? req.files.map((file) => ({
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        source: file.path.split(path.sep).join('/'),
      }))
    : null;
  const sentBy = req.user.user._id;

  if (!content && !attachment) {
    return res.status(400).json({
      error: { message: "Content is required" },
    });
  }
  const message = {
    content: content,
    sentBy: sentBy,
    spaceId: spaceId,
    attachment: attachment,
  };

  try {
    const sentMessage = await spacesService.sendMessageInSpace(
      content,
      spaceId,
      sentBy,
      attachment
    );
    
    global.io.to(spaceId).emit("new message", { message: sentMessage });
    return res.status(201).json({
      data: sentMessage,
    });
  } catch (error) {
    res.status(500).json({
      error: { message: error.message },
    });
  }
};

const getMessagesInSpace = async (req, res) => {
  const { spaceId } = req.params;
  const type = req.query.type ?? "";
  const page = req.query.page ?? "";
  const limit = req.query.limit ?? 10;
  const offset = page === "" ? req.query.offset ?? "" : (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    return res.status(400).json({
      error: {
        message: "Invalid space id",
      },
    });
  }
  try {
    const resp = await spacesService.getAllMessageInSpace(
      spaceId,
      page,
      limit,
      offset
    );
    res.status(200).json({
      data: resp.results,
      page: resp.page,
      offset: resp.offset,
      limit: resp.limit,
      totalItems: resp.totalItems,
      totalPages: resp.totalPages,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
};


const deleteSpace = async (req, res, next) => {
  const { spaceId } = req.params;
  const userId = req.user.user._id;
  console.log(userId)
    
  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    return res.status(400).json({
      error: {
        message: "Invalid space id",
      },
    });
  }
  try {
    const deletedSpace = await spacesService.deleteSpaceById(spaceId, userId);
    return res.status(200).json({
      data: deletedSpace
    });
  } catch (error) {
    next(error)
  }

}


const generateMeetingToken = async (req, res, next) => {
  const username = req.user.user.username;
  const { spaceId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    return res.status(400).json({
      error: {
        message: "Invalid space id",
      },
    });
  }

  try {
    const token = await spacesService.generateToken(username,spaceId);
    return res.status(201).json({
      data: {
        token
      }
    });

  } catch (error) {
    next(error)
    
  }
}


const getBotMessagesInSpace = async (req, res) => {
  const { spaceId } = req.params;
  const type = req.query.type ?? "";
  const page = req.query.page ?? "";
  const limit = req.query.limit ?? 10;
  const offset = page === "" ? req.query.offset ?? "" : (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    return res.status(400).json({
      error: {
        message: "Invalid space id",
      },
    });
  }
  try {
    const resp = await botService.getAllBotMessageInSpace(
      spaceId,
      page,
      limit,
      offset
    );
    res.status(200).json({
      data: resp.results,
      page: resp.page,
      offset: resp.offset,
      limit: resp.limit,
      totalItems: resp.totalItems,
      totalPages: resp.totalPages,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }

}

const clearBotSpace = async (req, res, next) => {
  const { spaceId } = req.params;
  const userId = req.user.user._id;
  console.log(userId)
    
  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    return res.status(400).json({
      error: {
        message: "Invalid space id",
      },
    });
  }
  try {
    const clearSpace = await botService.clearSpaceById(spaceId);
    return res.status(200).json({
      data: clearSpace
    });
  } catch (error) {
    next(error)
  }
}


export default {
  createSpace,
  updateSpace,
  sendMessageInSpace,
  getMessagesInSpace,
  deleteSpace,
  generateMeetingToken,
  getBotMessagesInSpace,
  clearBotSpace
};
 