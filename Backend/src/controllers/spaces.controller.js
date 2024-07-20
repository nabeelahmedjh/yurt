import Space from "../models/space.model.js";
import Message from "../models/message.model.js";
import mongoose, { get } from "mongoose";
import spacesService from "../services/spaces.service.js";

const createSpace = async (req, res) => {
  const { name, description } = req.body;

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

    const newSpace = await Space.create({ name, description });

    res.status(201).json({
      data: newSpace
    });
  } catch (error) {
    res.status(400).json({
      error: { message: error.message }
    });
  }
};

const sendMessageInSpace = async (req, res) => {

  const { content } = req.body;
  const { spaceId } = req.params;
  const sentBy = req.user.user._id;

  if (!content) {
    return res.status(400).json({
      error: { message: "Content is required" },
    });
  }
  const message = {
    content: content,
    sentBy: sentBy,
    spaceId: spaceId,
  }
  console.log(message);
  try {
    const sentMessage = await spacesService.sendMessageInSpace(content, spaceId, sentBy);
    sentMessage.sentBy = req.user.user;
    return res.status(201).json({
      data: sentMessage
    });
  } catch (error) {
    res.status(500).json({
      error: { message: error.message }
    });
  }

};

const getMessagesInSpace = async (req, res) => {
  const { spaceId } = req.params;

  try {
    const messages = await spacesService.getAllMessageInSpace(spaceId);
    res.status(200).json({
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message
      }
    });
  }
};

export default {
  createSpace,
  sendMessageInSpace,
  getMessagesInSpace,
};
