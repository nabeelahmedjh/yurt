import mongoose from "mongoose";
import { Message, User } from "../models/index.js";
import { generatePassword } from "../utils/generate-pass.utils.js";
import { ValidationError, ConflictError, NotFoundError, ForbiddenError, InternalServerError } from "../utils/customErrors.js";

const seedDeleteUser = async () => {
  const passwordHash = await generatePassword("EnglishOrSpanish");
  const userData = {
    username: "Deleted",
    bio: "This user is no longer with us. Disappeared like a magician's rabbit, but the mystery lingers...",
    avatar: {
      name: "deleteUserAvatar.svg",
      size: 3280,
      type: "image/svg+xml",
      source:
        "uploads\\dummyUserAvatar\\deleteUserAvatar-351535690-1725027583680.svg",
    },
    email: "noLongerExist@delete.com",
    password: passwordHash,
  };

  const existingDummyUser = await User.findOne({ username: userData.username });

  if (!existingDummyUser) {
    const newUser = new User(userData);
    await newUser.save();
    console.log("User created successfully");
  }
};




const getUser = async (userId) => {
  const user = await User.findById(userId).populate("interests");
  return user;
};




const updateAvatar = async (userId, avatar) => {
  const updatedAvatar = await User.findByIdAndUpdate(userId, { avatar: avatar }, {new:true});
  return updatedAvatar;
};





const updateUser = async (userId, userData) => {


  try {

  if(userData.email){
    throw new ForbiddenError("You can not change email.")
  }

  if(userData.username.toLowerCase() === "deleted" || userData.username.toLowerCase() === "delete"){
    throw new ForbiddenError("please choose an other name.")
  }

  if (userData.username) {
    const userExist = await User.findOne({
      username: userData.username,
      _id: { $ne: userId },
    }).collation({ locale: "en", strength: 2 });
    console.log(userExist);

    if (userExist) {
      throw new ConflictError("User with this name already exists")
    }
  }
  
    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    }).populate("interests");

    return updatedUser;
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError) {
      throw error;
    }
    else if (error.name === "CastError") {
      throw new Error("Invalid user ID");
    } else if (error.name === "ValidationError") {
      throw new Error(`Validation failed: ${error.message}`);
    } else {
      throw error;
    }
  }
};

const getAllUsers = async (username, searchType) => {
  let matchCondition;

  if (searchType === "strict") {
    matchCondition = {
      username: {
        $regex: `^${username}$`, // 
        $options: "i",            
      },
    };
  } else if (searchType === "contain") {
    matchCondition = {
      username: {
        $regex: username,
        $options: "i",
      },
    };
  } else {
    throw new Error("Invalid searchType");
  }

  const allUsers = await User.aggregate([
    {
      $match: matchCondition,
    },
    {
      $match: {
        username: { $ne: "Deleted" }, // Exclude user with username "Deleted"
      },
    },
    {
      $project: {
        username: 1,
        Bio: 1,
        avatar: 1,
        email: 1,
        interest: 1,
        _id: 1,
      },
    },
  ]);

  return allUsers;
};

const deletedUser = async (userId) => {
  console.log("service");
  try {
    const dummyUser = await User.findOne({ username: "Deleted" });
    const updatedDummy = await Message.updateMany(
      { sentBy: userId },
      { $set: { sentBy: dummyUser._id } }
    );

    const deleteResult = await User.deleteOne({ _id: userId });

    return { updatedDummy, deleteResult };
  } catch (error) {
    console.log("ErrorMessage", error);
  }
};

export default {
  getUser,
  updateAvatar,
  updateUser,
  getAllUsers,
  seedDeleteUser,
  deletedUser,
};
