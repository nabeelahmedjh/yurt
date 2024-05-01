import Space from "../models/space.model.js";
import Message from "../models/message.model.js";

const createSpace = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newSpace = await Space.create({ name, description });

    res.status(201).json(newSpace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const { message, messageType } = req.body;
    const { spaceId } = req.params;
    // const sentBy = req.user._id;
    const newMessage = await Message.create({
      message,
      messageType,
      sentBy,
      readBy,
      spaceId,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  createSpace,
  createMessage,
};
