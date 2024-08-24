import moongose from "mongoose";
import Tag from "./tag.model.js";

const serverSchema = new moongose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    banner: {
      type: Object,
      required: false,
      default: null
    },
    serverImage: {
      type: Object,
      required: false,
      default: null
    },
    tags: [
      {
        type: moongose.Schema.Types.ObjectId,
        ref: "Tag",
        default: [],
      },
    ],
    spaces: [
      {
        type: moongose.Schema.Types.ObjectId,
        ref: "Space",
      },
    ],
    admins: [
      {
        type: moongose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: moongose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

serverSchema.pre('save', async function (next) {
  console.log(this)
  const tags = this.tags;

  if (tags.length > 0) {
    tags.forEach(async (tag) => {
      await Tag.findByIdAndUpdate(tag, { $inc: { usageCount: 1 } });
    });
  }
  next();
});


serverSchema.pre('findOneAndUpdate', async function (next) {

  const oldTags = this.getQuery().tags;
  const newTags = this.getUpdate().$set.tags;

  const removedTags = oldTags.filter((tag) => !newTags.includes(tag));
  const addedTags = newTags.filter((tag) => !oldTags.includes(tag));

  if (removedTags.length > 0) {
    removedTags.forEach(async (tag) => {
      await Tag.findByIdAndUpdate(tag, { $inc: { usageCount: -1 } });
    });
  }

  if (addedTags > 0) {
    removedTags.forEach(async (tag) => {
      await Tag.findByIdAndUpdate(tag, { $inc: { usageCount: 1 } })
    });
  }
  next();
});

serverSchema.pre("deleteOne", async function (next) {
  const tags = this.tags;

  if (tags.length > 0) {
    tags.forEach(async (tag) => {
      await Tag.findByIdAndUpdate(tag, { $inc: { usageCount: -1 } });
    });
  }
});

const Server = moongose.model("Server", serverSchema);
export default Server;
