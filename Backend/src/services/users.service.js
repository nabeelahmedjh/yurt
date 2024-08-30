import mongoose from "mongoose";
import {User} from "../models/index.js";


const getUser = async (userId) => {
    
    const user = await User.findById(userId);
    return user;
}


const updateAvatar = async (userId, avatar) => {

    const Avatar = await User.findByIdAndUpdate(userId, {avatar: avatar});
    return Avatar;
}


const updateUser = async (userId, userData) => {

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, userData, {
            new: true, 
            runValidators: true 
        });
        return updatedUser;

    } catch (error) {
        if (error.name === 'CastError') {
            throw new Error('Invalid user ID');
        } else if (error.name === 'ValidationError') {
            throw new Error(`Validation failed: ${error.message}`);
        } else {  
            throw error;
        }
    }
}


const getAllUsers = async (username, searchType) => {
    let matchCondition;

    if (searchType === "strict") {
        matchCondition = { username: username };
    } else if (searchType === "contain") {
        matchCondition = { 
            username: {
                $regex: username,
                '$options': "i"
            }
        };
    } else {
        throw new Error("Invalid searchType");
    }

    const allUsers = await User.aggregate([
        {
            $match: matchCondition
        },
        {
            $project: {
                username: 1,
                Bio: 1,
                avatar: 1,
                email: 1,
                interest: 1,
                _id: 1
            }
        }
    ]);

    return allUsers;
}


const deletedUser = async (userId)  => {
    
}


export default {
    getUser,
    updateAvatar,
    updateUser,
    getAllUsers,
    deletedUser
};