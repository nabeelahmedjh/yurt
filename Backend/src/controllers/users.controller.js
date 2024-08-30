import { serversService, usersService } from "../services/index.js";

const getUser = async (req, res) => {
  const userId = req.user.user._id;
  console.log(userId);

  try {
    const user = await usersService.getUser(userId);
    if (!user) {
      return res.status(404).json({
        error: { message: "User not found" },
      });
    }
    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message },
    });
  }
};

const updateAvatar = async (req, res) => {
  const userId = req.user.user._id;
  const avatar = req.file
    ? {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        source: req.file.path,
      }
    : null;

  console.log(avatar);

  try {
    const updateAvatar = await usersService.updateAvatar(userId, avatar);
    return res.status(200).json({
      data: updateAvatar,
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message },
    });
  }
};

const updateUser = async (req, res) => {
  const userId = req.user.user._id;
  const userData = req.body;

  try {
    const updatedUser = await usersService.updateUser(userId, userData);

    if (!updatedUser) {
      return res.status(404).json({ error: { message: "User not found" } });
    }
    return res.status(200).json({
      data: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyValue && error.keyValue.username) {
      return res.status(409).json({
        error: {
          message: "Username already exists. Please use a different username.",
        },
      });
    } else {
      return res.status(500).json({
        error: { message: error.message },
      });
    }
  }
};

const getAllUsers = async (req, res) => {
  const username = req.query.username ?? "";
  const searchType = req.query.searchType ?? "";
  try {
    const users = await usersService.getAllUsers(username, searchType);

    if (Array.isArray(users) && users.length === 0) {
      return res.status(404).json({
        error: { message: "No users found" },
      });
    }

    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message },
    });
  }
};

const deleteUser = async (req, res) => {
  console.log("controller");
  const userId = req.user.user._id;
  try {
    const deletedUser = await usersService.deletedUser(userId);
    console.log(deletedUser);
    return res.status(200).json({
      data: deletedUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message },
    });
  }
};

export default {
  getUser,
  updateAvatar,
  updateUser,
  getAllUsers,
  deleteUser,
};
