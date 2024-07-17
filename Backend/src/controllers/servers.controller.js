import { Server, User } from "../models/index.js";
import { serversService } from "../services/index.js";
const createServer = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newServer = await serversService.createServer(req, res);

    if (newServer.error) {
      throw new Error(newServer.error.message);
    }

    return res.status(newServer.status).json(newServer.data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getServers = async (req, res) => {
  try {
    const servers = await serversService.getServers(req, res);
    return res.json({
      status: 200,
      data: servers
    })
  } catch (error) {
    return res.json({
      status: 500,
      error: { message: error.message },
    })
  }
};

const createSpace = async (req, res) => {
  try {
    const newSpace = await serversService.createSpace(req, res);
    return res.json({
      status: 201,
      data: newSpace,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const joinServer = async (req, res) => {
  try {
    const { serverId } = req.params;
    const user = req.user.user;
    const server = await Server.findOne({
      _id: serverId,
    });

    if (!server || server.length === 0) {
      return res.status(404).json({
        message: "Server not found",
      });
    }

    if (server.members.includes(user._id)) {
      return res.status(400).json({
        message: "User already in server",
      });
    }

    server.members.push(user._id);
    await server.save();

    try {
      const currentUser = await User.findOne({ _id: user._id });
      currentUser.serversJoined.push(server._id);
      await currentUser.save();

    } catch (error) {
      return res.json({
        status: 500,
        error: { message: error.message },
      });
    }

    return res.json({
      status: 201,
      data: server,
    });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
export default {
  createServer,
  getServers,
  createSpace,
  joinServer,
};
