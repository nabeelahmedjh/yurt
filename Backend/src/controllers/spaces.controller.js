import Space from "../models/space.model.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";

const createSpace = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.json({
        status: 400,
        error: { message: "Name is required" },
      });
    }

    if (!description) {
      return res.json({
        status: 400,
        error: { message: "Description is required" },
      });
    }

    const newSpace = await Space.create({ name, description });

    res.status(201).json(newSpace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendMessageInSpace = async (req, res) => {
  try {
    const { content } = req.body;
    const { spaceId } = req.params;
    const sentBy = req.user.user._id;

    // console.log(req)
    // const sentBy = req.user._id;
    const newMessage = await Message.create({
      content,
      sentBy,
      spaceId,
    });

    const newMessageObj = newMessage.toObject();
    newMessageObj.sentBy = req.user.user;

    global.io.sockets.emit("new message", { message: newMessageObj });
    res.status(201).json(newMessageObj);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  try {
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
};

const getMessagesInSpace = async (req, res) => {
  try {
    const { spaceId } = req.params;
    console.log(spaceId);
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
        },
      },
      { $unwind: "$sentBy" },
    ]);

    // const messages = await Message.find({ spaceId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  createSpace,
  sendMessageInSpace,
  getMessagesInSpace,
};
