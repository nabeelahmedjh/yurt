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
      default: function() {
        return `user_${Date.now()}`;
    }},
    bio:{
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
    botSpace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      defualt: null,
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
    educationalDetails: {
      educationalEmail: {
        type: String,
        required: false,
      },
      verified: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        required: false,
        default: '',
      },
    },
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
