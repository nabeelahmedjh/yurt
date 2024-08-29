import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    spaceImage: {
      type: Object,
      required: false,
      default: null
    },
    type: {
      type: String,
      required: false,
      default: "chat",
    },
  },
  { timestamps: true }
);

const Space = mongoose.model("Space", spaceSchema);

export default Space;
