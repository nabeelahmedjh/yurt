
import Together from 'together-ai';
import { Message, Server, User, Space } from "../models/index.js";

const together = new Together({
  apiKey: process.env['TOGETHER_API_KEY'],
});

const chatHistory = {};

const processBotMessage = async (eventPayload, userId) => {
    const userMessage = eventPayload.content;
    const spaceId = eventPayload.spaceId;
    console.log(spaceId);
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
            content: 'You are a knowledgeable and friendly tutor, specialized in helping students with their academic questions. Your goal is to provide clear, helpful, and accurate answers in a way that is easy to understand. You should also be encouraging and supportive, helping students learn and gain confidence in their studies. Answer questions across subjects like math, science, history, literature, and more.',
        };

        messagesForModel.unshift(systemMessage);

        
        // await Message.create({
        //     spaceId: spaceId,
        //     content: userMessage,
        //     sentBy: userId,
        //     role: 'user',
        // });

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
            // await Message.create({
            //     spaceId: spaceId,
            //     content: buffer,
            //     sentBy: null,
            //     role: 'assistant',
            // });

            chatHistory[userId].push({ role: 'assistant', content: buffer });
            
            return buffer;
        }

        throw new Error('No response generated');

    } catch (error) {
        console.error('Error handling message:', error);
        return "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.";
    }
};

export default {
    processBotMessage
};