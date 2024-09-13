import Server from '../models/server.model.js';
import Space from '../models/space.model.js';
import randomToken from 'random-token' ;



const getServerIdBySpaceId = async (spaceId) => {
    try {
        const server = await Server.findOne({ 'spaces': spaceId }, '_id').exec();
        console.log(server);
        return server;
        
    } catch (err) {
        console.error('Error finding server by spaceId:', err);
        return null;
    }
}



export default getServerIdBySpaceId;