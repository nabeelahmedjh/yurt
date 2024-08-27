// multerConfig.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import getServerIdBySpaceId from '../utils/functions.utils.js';

// Set storage engine
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const spaceId = req.params.spaceId;
            let dir;

            if (spaceId) {
                const serverId = await getServerIdBySpaceId(spaceId);
                const serverIdString = serverId._id.toString();
                dir = `./uploads/${serverIdString}/${spaceId}`;
            } else {
                dir = './uploads/profiles';
            }
            
            console.log('Directory:', dir);

            await fs.promises.mkdir(dir, { recursive: true });

            cb(null, dir);
        } catch (error) {
            console.error('Error creating directory:', error);
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        cb(null, path.parse(file.originalname).name + '-' + Math.round(Math.random() * 1E9) + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 1024 * 1024 * 5, // 5MB file size limit
        files: 5 // maximum file limit  
    }, 
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Files Only!');
    }
}

export default upload;