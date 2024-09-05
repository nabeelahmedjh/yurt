import mongose from "mongoose";
import Tag from "./tag.model.js";

const serverSchema = new mongose.Schema(
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
        type: mongose.Schema.Types.ObjectId,
        ref: "Tag",
        default: [],
        
      },
    ],
    spaces: [
      {
        type: mongose.Schema.Types.ObjectId,
        ref: "Space",
      },
    ],
    admins: [
      {
        type: mongose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongose.Schema.Types.ObjectId,
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


serverSchema.pre('findByIdAndUpdate', async function (next) {

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
    addedTags.forEach(async (tag) => {
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
  next();
});



const Server = mongose.model("Server", serverSchema);
export default Server;
