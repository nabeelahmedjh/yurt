import { Tag } from "../models/index.js"



const createTag = async (name, description) => {
    const newTag = await Tag.create({
        name,
        description
    });
    return newTag;
};

const getTags = async () => {
    const tags = await Tag.find().sort({"usageCount" : -1});
    return tags;
};

const bulkUploadTags = async (TagsJson) => {
    const tags = await Tag.insertMany(TagsJson);
    return tags;
};

const deleteTag = async (tagId) => {
    const tag = await Tag.findByIdAndDelete(tagId);
    console.log("DELETED TAG:", tag)
    return tag;
};

const updateTag = async (tagId, name, description) => {


    const tag = await tag.findByIdAndUpdate(tagId, {
        name: name,
        description: description
    }, { new: true });
    return tag;
};

const bulkDeleteTags = async () => {
    const tags = await Tag.deleteMany();
    return tags;
}


export default {
    createTag,
    getTags,
    bulkUploadTags,
    deleteTag,
    updateTag,
    bulkDeleteTags
};
