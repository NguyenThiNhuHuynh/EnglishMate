// models/comment.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  post: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  upVotes: number;
  downVotes: number;
}

const CommentSchema: Schema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "AskPost", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
