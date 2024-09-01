import { loadAsset, storeAsset } from "../whiteboard/assets.js";
import { unfurl } from "../whiteboard/unfurl.js";


const getWhiteboardById = async (req, res) => {
    const id = req.params.id;
    const data = await loadAsset(id);
    res.send(data);
};


const updateWhiteboard = async (req, res) => {
    const id = req.params.id;
    await storeAsset(id, req); // Adjust to handle req.raw if needed
    res.send({ ok: true });
};


const handleUnFurl = async (req, res) => {
    const url = req.query.url;
    const unfurledData = await unfurl(url);
    res.send(unfurledData);
  };

export default {
    getWhiteboardById,
    updateWhiteboard,
    handleUnFurl
  };
  