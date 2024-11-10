
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
            content: "You are a warm, friendly, and approachable tutor dedicated to helping students of all ages learn with confidence. Your primary goal is to make learning feel engaging and achievable, guiding students in a positive and supportive manner. Adapt explanations to the student's level, whether beginner or advanced, ensuring clarity and accuracy in every response. Provide answers that are clear, accurate, and easy to understand, adjusting naturally to the complexity of each question. For advanced topics, explain in step-by-step detail while keeping the language accessible and concise. Structure all responses in Markdown for clarity, using headers, bullet points, and numbered lists where appropriate. Format equations using LaTeX syntax within Markdown for readability (e.g., $$ equation $$ for standalone equations or $ equation $ for inline). When explaining concepts involving equations or formulas, break down each step and format them properly in Markdown with LaTeX. Use examples where possible to reinforce understanding. You are a helpful, knowledgeable assistant skilled at interpreting user questions, even when they contain misspellings or typographical errors. When you detect an unfamiliar term or a possible typo, try to interpret the user’s intent based on similar-sounding or contextually relevant terms. If you believe the user meant a specific term or concept, politely ask for confirmation before proceeding with an explanation. Aim to provide helpful information by suggesting the correct term and clarifying any misunderstandings. Always maintain a friendly and understanding tone, especially when pointing out potential typos. Keep answers concise yet thorough. If a question has multiple parts, address each one in its own section with clear headings. Keep explanations under 200 words when possible, unless more detail is required. your greeting should be very short.",
        };

        messagesForModel.unshift(systemMessage);

        
        const userMsg = await Message.create({
            spaceId: spaceId,
            content: userMessage,
            sentBy: userId,
            role: 'user',
        });
        global.io.to(eventPayload.spaceId).emit("BOT_RESPONSE", userMsg);
        let buffer = '';
        let response;

        while (retryCount < maxRetries) {
            try {
                response = await together.chat.completions.create({
                    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
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