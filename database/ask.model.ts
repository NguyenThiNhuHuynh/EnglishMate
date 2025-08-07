import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMedia {
  url: string;
  type: "image" | "video";
}

export interface IAskPost extends Document {
  content: string;
  fixedByAI?: string;
  author: Types.ObjectId;
  tags?: string[];
  audioUrl?: string;
  media?: IMedia[];
  status: "pending" | "answered" | "closed";
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
  },
  { _id: false }
);

const AskPostSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    fixedByAI: String,
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [String],
    audioUrl: String,
    media: [MediaSchema],
    status: {
      type: String,
      enum: ["pending", "answered", "closed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAskPost>("AskPost", AskPostSchema);
