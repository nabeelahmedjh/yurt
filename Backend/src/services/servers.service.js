import { Server, Space } from "../models/index.js";

const createServer = async (req, res) => {
  const user = req.user.user;
  console.log(user);

  try {
    const { name, description } = req.body;
    const newServer = await Server.create({
      name,
      description,
      admins: [user._id],
    });
    return {
      status: 201,
      data: newServer,
    };
  } catch (error) {
    return {
      status: 400,
      error: { message: error.message },
    };
  }
};

const getServers = async (req, res) => {
  const user = req.user;
  const { serversJoined } = user;

  //   if (serversJoined.length === 0) {
  //     return res.status(200).json([]);
  //   }

  try {
    const servers = await Server.aggregate([
      //   {
      //     $match: {
      //       _id: { $in: serversJoined },
      //     },
      //   },
      {
        $lookup: {
          from: "spaces",
          localField: "spaces",
          foreignField: "_id",
          as: "spaces",
        },
      },
    ]); // Add the aggregation pipeline to get the servers the user has joined and its spaces
    return {
      status: 200,
      data: servers,
    };
  } catch (error) {
    return {
      status: 400,
      message: error.message,
    };
  }
};

const createSpace = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { name, description } = req.body;
    const newSpace = await Space.create({
      name,
      description,
      server: serverId,
    });

    const server = await Server.findById(serverId);
    server.spaces.push(newSpace._id);
    await server.save();

    return {
      status: 201,
      data: newSpace,
    };
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default {
  createServer,
  getServers,
  createSpace,
};
