import mongoose from "mongoose";
import Server from "./server.model.js";

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        usageCount: {
            type: Number,
            required: false,
            default: 0
        },
    },
    { timestamps: true }
);

tagSchema.pre('findByIdAndDelete', async function (next) {
    const tag = this.getQuery()._id;


    await this.model('Server').updateMany(
        { tags: tag },
        { $pull: { tags: tag } }
    );
    next();
});

tagSchema.pre('deleteMany', async function (next) {
    next();
});

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;