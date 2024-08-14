import { tagsService } from "../services/index.js";
import fs from "fs";
import path from "path";

const createTag = async (req, res) => {

    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            error: { message: "Name is required" },
        });
    }

    if (!description) {
        return res.status(400).json({
            error: { message: "Description is required" },
        });
    }

    try {

        const newTag = await tagsService.createTag(name, description);
        return res.status(201).json({
            data: newTag
        });

    } catch (error) {
        return res.status(500).json({
            error: {
                message: error.message
            }
        });
    }
}


const getTags = async (req, res) => {

    try {
        const tags = await tagsService.getTags();
        return res.status(200).json({
            data: tags
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                message: error.message
            }
        });
    }
}

const bulkUploadTags = async (req, res) => {

    try {
        const tagsJson = JSON.parse(fs.readFileSync('./tags.json', "utf-8"));
        const tags = await tagsService.bulkUploadTags(tagsJson);
        return res.status(200).json({
            data: tags
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                message: error.message
            }
        });
    }
}

const deleteTag = async (req, res) => {

    const { tagId } = req.params;
    // console.log(tagId)

    try {
        const tag = await tagsService.deleteTag(tagId);
        return res.status(200).json({
            data: tag
        });

    } catch (error) {
        return res.status(500).json({
            error: {
                message: error.message
            }
        });
    }
}

const updateTag = async (req, res) => {
    const { tagId } = req.params;

    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            error: { message: "Name is required" },
        });
    }

    if (!description) {
        return res.status(400).json({
            error: { message: "Description is required" },
        });
    }

    try {
        const tag = await tagsService.updateTag(tagId, name, description);
        return res.status(200).json({
            data: tag
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                message: error.message
            }
        });
    }
}

export default {
    createTag,
    getTags,
    bulkUploadTags,
    deleteTag,
    updateTag
};