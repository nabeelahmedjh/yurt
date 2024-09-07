import { Server, User } from "../models/index.js";
import { serversService } from "../services/index.js";
import mongoose from "mongoose";


const createServer = async (req, res, next) => {
  const { name, description, isPublic } = req.body;
  let tags = req.body.tags ?? [];
  const user = req.user.user;


  const banner =
    req.files["banner"] && req.files?.["banner"]?.[0]
      ? {
          name: req.files["banner"][0].originalname,
          size: req.files["banner"][0].size,
          type: req.files["banner"][0].mimetype,
          source: req.files["banner"][0].path,
        }
      : null;

  const serverImage =
    req.files["serverImage"] && req.files?.["serverImage"]?.[0]
      ? {
          name: req.files["serverImage"][0].originalname,
          size: req.files["serverImage"][0].size,
          type: req.files["serverImage"][0].mimetype,
          source: req.files["serverImage"][0].path,
        }
      : null;

  if (typeof tags === "string") {
    tags = JSON.parse(tags);
  }

  if (!name) {
    return res.status(400).json({
      error: { message: "name is required" },
    });
  }

  if (!description) {
    return res.status(400).json({
      error: { message: "description is required" },
    });
  }

  try {
    const newServer = await serversService.createServer(
      name,
      description,
      user,
      isPublic,
      banner,
      serverImage,
      tags
    );

    
    
    return res.status(201).json({
      data: newServer
    });
  
  } catch (error) {
    next(error);
  }
};






const updateServer = async (req, res, next) => {
  const { serverId } = req.params;
  let tags = req.body.tags ?? null;
  const { name , description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(serverId)) {
    return res.status(400).json({
      error: {
        message: "Invalid server id",
      },
    });
  }

  const userId = req.user.user._id;

  const banner =
    req.files["banner"] && req.files?.["banner"]?.[0]
      ? {
          name: req.files["banner"][0].originalname,
          size: req.files["banner"][0].size,
          type: req.files["banner"][0].mimetype,
          source: req.files["banner"][0].path,
        }
      : null;

  const serverImage =
    req.files["serverImage"] && req.files?.["serverImage"]?.[0]
      ? {
          name: req.files["serverImage"][0].originalname,
          size: req.files["serverImage"][0].size,
          type: req.files["serverImage"][0].mimetype,
          source: req.files["serverImage"][0].path,
        }
      : null;


  try {
    const updatedServer = await serversService.updateServer(
      userId,
      serverId,
      name,
      description,
      banner,
      serverImage,
      tags
    );
    return res.status(200).json({
      data: updatedServer,
    });
  } catch (error) {
    next(error)
  }
};




const getServers = async (req, res, next) => {
  const type = req.query.type ?? "all";
  const searchtype = req.query.searchType ?? "";
  const servername = req.query.search ?? "";
  let tags = req.query.tags ?? [];
  

  try {
    if (!type || type === "joined") {
      const servers = await serversService.getJoinedServers(req, res);
      return res.status(200).json({
        data: servers,
      });
    } else if (type === "all") {
      const user = req.user;
      const userId = user.user._id;
      const page = req.query.page ?? "";
      const limit = req.query.limit ?? 10;
      const offset = page === "" ? req.query.offset ?? "" : (page - 1) * limit;

      const servers = await serversService.getAllServers(
        userId,
        servername,
        searchtype,
        tags,
        page,
        limit,
        offset
      );
      return res.status(200).json({
        data: servers.results,
        page: servers.page,
        offset: servers.offset,
        limit: servers.limit,
        totalItems: servers.totalItems,
        totalPages: servers.totalPages,
      });
    } else {
      return res.status(400).json({
        data: "Please apply filter correctly. type=joined 0r type=all.",
      });
    }
  } catch (error) {
    next(error)
  }
};






const getServer = async (req, res) => {
  const { serverId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(serverId)) {
    return res.status(400).json({
      error: {
        message: "Invalid server id",
      },
    });
  }
  try {
    const server = await serversService.getServerById(serverId);
    return res.status(200).json({
      data: server,
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message },
    });
  }
};







const createSpace = async (req, res) => {
  const { serverId } = req.params;
  const name = req.body.name;
  const description = req.body.description;
  const type = req.body.type ?? "chat";

  const spaceImage = req.file
    ? {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        source: req.file.path,
      }
    : null;

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
    const newSpace = await serversService.createSpace(
      serverId,
      name,
      description,
      spaceImage,
      type
    );
    return res.status(201).json({
      data: newSpace,
    });
  } catch (error) {
    return res.status(400).json({
      error: { message: error.message },
    });
  }
};



const joinServer = async (req, res, next) => {
  const { serverId }= req.params
  const userId = req.user.user._id;
 
  if (!mongoose.Types.ObjectId.isValid(serverId)) {
    return res.status(400).json({
      error: {
        message: "Invalid server id",
      },
    });
  }

  try {
    const server = await serversService.joinPublicServer(serverId, userId);
    return res.status(200).json({
      data: server
    });
  } catch (error) {
    next(error)
  }
};


const leaveServer = async (req, res, next) => {
  const { serverId }= req.params
  const userId = req.user.user._id;
 
  if (!mongoose.Types.ObjectId.isValid(serverId)) {
    return res.status(400).json({
      error: {
        message: "Invalid server id",
      },
    });
  }
  try {
    const server = await serversService.leaveServer(serverId, userId);
    return res.status(200).json({
      data: server
    });
  } catch (error) {
    next(error)
  }
};



const generateInviteCode = async (req, res, next) => {
  const { serverId }= req.params
  const userId = req.user.user._id;
  const usageLimit  = req.body.usageLimit ?? 60;
  const expiresIn = req.body.expiresIn ?? 7*24*60*60;

  

  try {
    const inviteCode = await serversService.generateInviteCode(serverId, userId, expiresIn, usageLimit);
    res.json({ data: inviteCode });
  } catch (error) {
    next(error)
  }
};




const joinServerWithInviteCode = async (req, res, next) => {
  const { inviteCode } = req.params
  const userId = req.user.user._id
  try {
    const server = await serversService.joinServerWithInviteCode(inviteCode, userId);
    res.json({ message: 'Joined server successfully', server });
  } catch (error) {
    next(error)
  }
};


const getMembers = async (req, res) => {
  const { serverId } = req.params;
  const type = req.query.type ?? "";
  const page = req.query.page ?? "";
  const limit = req.query.limit ?? 10;
  const offset = page === "" ? req.query.offset ?? "" : (page - 1) * limit;

  if (!type) {
    return res.status(400).json({
      error: {
        message: "Please provide type",
      },
    });
  }

  if (!serverId) {
    return res.status(400).json({
      error: { message: "ServerId is required" },
    });
  }

  let resp = null;
  try {
    resp = await serversService.getMembersByServerId(
      serverId,
      page,
      limit,
      offset,
      type
    );

    return res.status(200).json({
      data: resp.results,
      page: resp.page,
      offset: resp.offset,
      limit: resp.limit,
      totalItems: resp.totalItems,
      totalPages: resp.totalPages,
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message },
    });
  }

  res.json({
    data: "getMembers",
  });
};



export const deleteServer = async (req, res, next) => {
  const { serverId } = req.params;
  const userId = req.user.user._id; 

  try {
    const deletedServer = await serversService.deleteServerById(serverId, userId);
    return res.status(200).json({
      data: deletedServer
    });
  } catch (error) {
    next(error);
  }
};







export default {
  createServer,
  updateServer,
  getServers,
  getServer,
  createSpace,
  joinServer,
  leaveServer,
  getMembers,
  generateInviteCode,
  joinServerWithInviteCode,
  deleteServer,
};
