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
    spaceBanner: {
      type: String,
      required: false,
      default: ""
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
