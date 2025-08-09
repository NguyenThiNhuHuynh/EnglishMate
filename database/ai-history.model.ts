// import mongoose, { Schema, Document, Types } from "mongoose";

// export interface IAIHistory extends Document {
//   post: Types.ObjectId;
//   input: string;
//   output: string;
//   explanation?: string;
// }

// const AIHistorySchema: Schema = new Schema(
//   {
//     post: { type: Schema.Types.ObjectId, ref: "AskPost", required: true },
//     input: String,
//     output: String,
//     explanation: String,
//   },
//   { timestamps: true }
// );

// const IAIHistory =
//   mongoose.models.IAIHistory ||
//   mongoose.model<IAIHistory>("AIHistory", AIHistorySchema);

// export default IAIHistory;
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

const AIHistoryModel =
  mongoose.models.AIHistory ||
  mongoose.model<IAIHistory>("AIHistory", AIHistorySchema);

export default AIHistoryModel;
