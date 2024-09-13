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
