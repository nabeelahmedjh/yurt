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
    global.io.sockets.emit("new message", { message: newMessage });
    res.status(201).json(newMessage);
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
    const messages = await Message.aggregate([
      {
        $match: {
          spaceId: spaceId,
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
