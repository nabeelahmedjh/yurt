import mongoose from "mongoose";
import { Message, Server, User, Space } from "../models/index.js";
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
        "uploads/dummyUserAvatar/deleteUserAvatar-351535690-1725027583680.svg",
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
  const user = await User.findById(userId).populate("interests").select("-serversJoined");
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
    throw new ConflictError("User with this name already exists.")
  }

  if (userData.username) {
    const userExist = await User.findOne({
      username: userData.username,
      _id: { $ne: userId },
    }).collation({ locale: "en", strength: 2 });
  

    if (userExist) {
      throw new ConflictError("User with this name already exists.")
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

  if(username.toLowerCase() === "delete" || username.toLowerCase() === "deleted"){
    throw new ConflictError("user exits");
  }


  let matchCondition;

  if (searchType === "strict") {
    matchCondition = {
      username: {
        $regex: `^${username}$`, // 
        $options: "i",            
      },
    };
  } else if (searchType === "contain" || searchType === "") {
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

  try {
    const dummyUser = await User.findOne({ username: "Deleted" });
    const updatedDummy = await Message.updateMany(
      { sentBy: userId },
      { $set: { sentBy: dummyUser._id } }
    );
    const server = await Server.findOne({admins : userId})
    if(!server || server.admins > 1) {
      const deleteResult = await User.deleteOne({ _id: userId });
      return {message : "User deleted successfully"}
    }

    for (const spaceId of server.spaces) {
      
      await Message.deleteMany({ spaceId });

      await Space.findByIdAndDelete(spaceId);

      const spacePath = path.join(process.cwd(), 'uploads', server._id.toString(), spaceId.toString());

    }
    const deleteResult = await User.deleteOne({ _id: userId });
    return { message : "Admin user deleted"  };
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
