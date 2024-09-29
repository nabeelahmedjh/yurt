import { serversService, usersService } from "../services/index.js";
import { sendMail } from "../utils/email-verification.js";
import jwt from "jsonwebtoken";


const getCurrentUser = async (req, res) => {
  const userId = req.user.user._id;


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


  try {
    const newAvatar = await usersService.updateAvatar(userId, avatar);
    return res.status(200).json({
      data: newAvatar,
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message },
    });
  }
};

const updateUser = async (req, res, next) => {
  const userId = req.user.user._id;
  const userData = req.body;
  const { educationalEmail } = req.body || {};



  if (educationalEmail) {
    const token = jwt.sign(
      { email: educationalEmail },
      process.env.JWT_SECRET
    );
    sendMail(educationalEmail, token, "EDUCATIONAL");
  }


  try {
    const updatedUser = await usersService.updateUser(userId, userData);

    if (!updatedUser) {
      return res.status(404).json({ error: { message: "User not found" } });
    }
    return res.status(200).json({
      data: updatedUser,
    });
  } catch (error) {
    next(error); 
  }
};

const getAllUsers = async (req, res) => {
  const username = req.query.username ?? "";
  const searchType = req.query.searchType ?? "";
  try {
    const users = await usersService.getAllUsers(username, searchType);

   
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
  getCurrentUser,
  updateAvatar,
  updateUser,
  getAllUsers,
  deleteUser,
};
