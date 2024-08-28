import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      unique: false,
      default: "Username"
    },
    Bio:{
      type: String,
      required: false,
      default: ""

    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      Select: false,
    },
    avatar: {
      type: Object,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    serversJoined: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Server",
        default: [],
      },
    ],
    interests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        default: [],
      },
    ],
  },
  {
    toJSON: {
      transform: function (doc, ret, options) {
        delete ret.password;
        return ret;
      }
    },
    // toObject: {
    //   transform: function (doc, ret, options) {
    //     delete ret.password;
    //     return ret;
    //   }
    // }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
