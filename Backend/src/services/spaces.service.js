
import { Server } from "../models/index.js"
import { Message } from "../models/index.js"
import mongoose from "mongoose";

const getJoinedSpacesIds = async (userId) => {

    const servers = await Server.find({ members: userId });
    let spacesIds = [];
    servers.map((server) => {
        spacesIds = [...spacesIds, ...server.spaces];
    });
    return spacesIds;

};

const sendMessageInSpace = async (content, spaceId, sentBy, attachment) => {
   
    const newMessage = await Message.create({
        content: content,
        sentBy: sentBy,
        spaceId: spaceId,
        attachment: attachment,

    });
    


    const newMessageObj = newMessage.toObject();
    return newMessageObj;
}

const getAllMessageInSpace = async (spaceId) => {
    const messages = await Message.aggregate([
        {
            $match: {
                spaceId: new mongoose.Types.ObjectId(spaceId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "sentBy",
                foreignField: "_id",
                as: "sentBy",
                // hide password field
                pipeline: [
                    {
                        $project: {
                            password: 0
                        }
                    }
                ]
            },
        },
        { $unwind: "$sentBy" },
    ]);
    return messages;
}
export default {
    getJoinedSpacesIds,
    sendMessageInSpace,
    getAllMessageInSpace
}