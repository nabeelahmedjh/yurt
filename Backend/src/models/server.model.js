import moongose from "mongoose";

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
      type: String,
      required: false,
      default: ""
    },
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

const Server = moongose.model("Server", serverSchema);
export default Server;
