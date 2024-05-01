import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      default: "",
    },
    // userIds: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Space = mongoose.model("Space", spaceSchema);

export default Space;
