import Space from "../models/space.model.js";
import Message from "../models/message.model.js";
import mongoose, { get } from "mongoose";
import spacesService from "../services/spaces.service.js";

const createSpace = async (req, res) => {
  const { name, description, spaceBanner, type } = req.body;

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
      spaceBanner,
      type
    );
    res.status(201).json({
      data: newSpace,
    });
  } catch (error) {
    res.status(500).json({
      error: { message: error.message },
    });
  }
};

const sendMessageInSpace = async (req, res) => {
  const { content } = req.body;
  const { spaceId } = req.params;

  const attachment = req.files
    ? req.files.map((file) => ({
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        source: file.path,
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
    sentMessage.sentBy = req.user.user;
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

export default {
  createSpace,
  sendMessageInSpace,
  getMessagesInSpace,
};
