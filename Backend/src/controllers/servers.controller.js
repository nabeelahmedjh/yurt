import { Server, User } from "../models/index.js";
import { serversService } from "../services/index.js";
const createServer = async (req, res) => {
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

    const newServer = await serversService.createServer(req, res);

    return res.status(201).json({
      data: newServer
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message
      }
    });
  }
};

const getServers = async (req, res) => {
  try {
    const servers = await serversService.getServers(req, res);
    return res.status(200).json({
      data: servers
    })
  } catch (error) {
    return res.status(200).json({
      error: { message: error.message },
    })
  }
};

const createSpace = async (req, res) => {

  const { serverId } = req.params;
  const { name, description } = req.body;

  if (!serverId) {
    return res.status(400).json({
      error: { message: "ServerId is required" },
    });
  }

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
    const newSpace = await serversService.createSpace(req, res);
    return res.status(201).json({
      data: newSpace,
    });
  } catch (error) {
    return res.status(400).json({
      error: { message: error.message }
    });
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
        error: { message: "Server not found" },
      });
    }

    if (server.members.includes(user._id)) {
      return res.status(400).json({
        error: { message: "User already in server" },
      })
    }

    server.members.push(user._id);
    await server.save();

    try {
      const currentUser = await User.findOne({ _id: user._id });
      currentUser.serversJoined.push(server._id);
      await currentUser.save();

    } catch (error) {
      return res.status(500).json({
        error: { message: error.message },
      });
    }

    return res.status(201).json({
      data: server,
    });

  } catch (error) {
    return res.status(500).json({
      error: { message: error.message },
    })
  }
}
export default {
  createServer,
  getServers,
  createSpace,
  joinServer,
};
