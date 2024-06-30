import { Server } from "../models/index.js";
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
    return res.status(servers.status).json(servers.data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const createSpace = async (req, res) => {
  try {
    const newSpace = await serversService.createSpace(req, res);
    return res.status(201).json(newSpace);
    console.log("hello");
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default {
  createServer,
  getServers,
  createSpace,
};
