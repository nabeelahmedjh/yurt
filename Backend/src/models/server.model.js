import mongoose from "mongoose";
import Tag from "./tag.model.js";



const serverSchema = new mongoose.Schema(
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        default: [],
        
      },
    ],
    spaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Space",
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    inviteCodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InviteCode",
      },
    ],
  },
  { timestamps: true }
);



serverSchema.pre('save', async function (next) {
  
  const tags = this.tags;


  if (tags.length > 0) {
    tags.forEach(async (tag) => {
      await Tag.findByIdAndUpdate(tag, { $inc: { usageCount: 1 } });
    });
  }
  next();
});


serverSchema.pre('findOneAndUpdate', async function (next) {
  
  console.log("pre findByIdAndUpdate");
  const serverId = this.getQuery()._id;
  const server = await this.model.findById(serverId).select('tags');
  const oldTags = server.tags || []; // Default to an empty array if tags are missing
  const newTags = this.getUpdate().$set.tags || []; // Default to an empty array if tags are missing

  const addedTags = newTags.filter((tag) => !oldTags.includes(tag));
  const removedTags = oldTags.filter((tag) => !newTags.includes(tag));

  // Decrement usage count for removed tags
  if (removedTags.length > 0) {
    await Promise.all(
      removedTags.map(async (tag) => {
        await Tag.findByIdAndUpdate(tag, { $inc: { usageCount: -1 } });
      })
    );
  }

  // Increment usage count for added tags
  if (addedTags.length > 0) {
    await Promise.all(
      addedTags.map(async (tag) => {
        await Tag.findByIdAndUpdate(tag, { $inc: { usageCount: 1 } });
      })
    );
  }

  next(); // Proceed after all updates are complete
});


serverSchema.pre("deleteOne", async function (next) {
  console.log("pre deleteOne");
  const server = await Server.findOne(this.getFilter());

  if (server && server.tags.length > 0) {
    server.tags.forEach(async (tag) => {
      await Tag.findByIdAndUpdate(tag, { $inc: { usageCount: -1 } })
    });
  }
  next();
});


async function generateUniqueInviteCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code;
  do {
    code = Array.from({length: 8}, () => characters[Math.floor(Math.random() * characters.length)]).join('');
  } while (await Server.findOne({ inviteCode: code }));
  
  return code;
}

const Server = mongoose.model("Server", serverSchema);
export default Server;
