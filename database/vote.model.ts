import mongoose, { Schema, Document, Types } from "mongoose";

export interface IVote extends Document {
  user: Types.ObjectId;
  comment: Types.ObjectId;
  voteType: "up" | "down";
}

const VoteSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
    voteType: { type: String, enum: ["up", "down"], required: true },
  },
  { timestamps: true }
);

VoteSchema.index({ user: 1, comment: 1 }, { unique: true }); // 1 user chỉ vote 1 lần/comment

export default mongoose.model<IVote>("Vote", VoteSchema);
