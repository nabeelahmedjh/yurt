import mongoose from "mongoose";

const inviteCodeSchema = new mongoose.Schema(
    {
      server: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server',
        required: true,
      },
      code: {
        type: String,
        required: true,
        unique: true,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
      usageLimit: {
        type: Number,
        required: true,
      },
      usageCount: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
  );
  
  const InviteCode = mongoose.model('InviteCode', inviteCodeSchema);

  export default InviteCode;
