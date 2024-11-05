
import Together from 'together-ai';
import { Message, Server, User, Space } from "../models/index.js";
import mongoose from "mongoose";
import pagination from "../utils/pagination.js";

const together = new Together({
  apiKey: process.env['TOGETHER_API_KEY'],
});

const chatHistory = {};

const processBotMessage = async (eventPayload, userId) => {
    const userMessage = eventPayload.content;
    const spaceId = eventPayload.spaceId;
    console.log("userID in botserverice:", userId);
    const maxRetries = 3;
    let retryCount = 0;

    try {
        if (!chatHistory[userId]) {
            chatHistory[userId] = [];
        }

        chatHistory[userId].push({ role: 'user', content: userMessage });

        const messagesForModel = chatHistory[userId].slice(-10);
        const systemMessage = {
            role: 'system',
            content: 'You are a friendly and approachable tutor with a warm, encouraging personality, dedicated to helping students of all ages learn with confidence. Provide answers that are clear, accurate, and easy to understand, adapting naturally to the complexity of each question. and always structure them in Markdown format for readability. Make learning feel engaging and achievable, offering guidance in a positive, supportive tone.',
        };

        messagesForModel.unshift(systemMessage);

        
        await Message.create({
            spaceId: spaceId,
            content: userMessage,
            sentBy: userId,
            role: 'user',
        });

        let buffer = '';
        let response;

        while (retryCount < maxRetries) {
            try {
                response = await together.chat.completions.create({
                    model: 'meta-llama/Meta-Llama-3-8B-Instruct-Lite',
                    messages: messagesForModel,
                    stream: true
                });

                for await (const chunk of response) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    buffer += content;
                }
                break;

            } catch (error) {
                retryCount++;
                console.warn(`Attempt ${retryCount}/${maxRetries} failed:`, error.message);
                
                if (retryCount === maxRetries) {
                    throw new Error('Max retries reached');
                }
                
    
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
            }
        }

     
        if (buffer) {
            const botresp = await Message.create({
                spaceId: spaceId,
                content: buffer,
                sentBy: spaceId,
                role: 'assistant',
            });

            chatHistory[userId].push({ role: 'assistant', content: buffer });
            
            return botresp;
        }

        throw new Error('No response generated');

    } catch (error) {
        console.error('Error handling message:', error);
        return "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.";
    }
};


const getAllBotMessageInSpace = async (spaceId, page, limit, offset) => {

    const messages = await Message.aggregate([
        {
          $match: {
            spaceId: new mongoose.Types.ObjectId(spaceId),
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);
    
      return pagination.paginateArray(page, limit, offset, messages);

    };

const clearSpaceById = async (spaceId) => {

    const clearMessages = await Message.deleteMany({spaceId: spaceId});
    return clearMessages;

}

export default {
    processBotMessage,
    getAllBotMessageInSpace,
    clearSpaceById
};