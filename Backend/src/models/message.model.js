import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    attachment: {
      type: Object,
      required: false,
      default: null,
    },
    content: {
      type: String,
      default: "",
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    spaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        readAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    referencedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
