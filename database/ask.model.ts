// models/ask.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAskPost extends Document {
  content: string;
  fixedByAI?: string;
  author: Types.ObjectId;
  tags?: string[];
  audioUrl?: string;
  status: "pending" | "answered" | "closed";
}

const AskPostSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    fixedByAI: String,
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [String],
    audioUrl: String,
    status: {
      type: String,
      enum: ["pending", "answered", "closed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAskPost>("AskPost", AskPostSchema);
