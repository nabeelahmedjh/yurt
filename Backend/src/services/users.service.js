import mongoose from "mongoose";
import {User} from "../models/index.js";


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


export default {getAllUsers};