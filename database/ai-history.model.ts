import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAIHistory extends Document {
  post: Types.ObjectId;
  input: string;
  output: string;
  explanation?: string;
}

const AIHistorySchema: Schema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "AskPost", required: true },
    input: String,
    output: String,
    explanation: String,
  },
  { timestamps: true }
);

export default mongoose.model<IAIHistory>("AIHistory", AIHistorySchema);
