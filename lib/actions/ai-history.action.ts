import AskPost, { IAskPost } from "@/database/ask.model";
import { connectToDatabase } from "../mongoose";
import mongoose from "mongoose";
import IAIHistory from "@/database/ai-history.model";
import { AIHistoryResponseDTO } from "@/dtos/ai-history.dto";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  static async fixContent(input: string): Promise<string> {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Fix this text:\n\n${input}`;

      const result = await model.generateContent(prompt);
      const output = result.response.text();

      return output.trim();
    } catch (error) {
      console.error("Error in GeminiService:", error);
      throw new Error("Failed to process the request");
    }
  }
}

export async function aiFixAskPost(
  askPostId: string
): Promise<{ fixedPost: IAskPost; aiHistory: AIHistoryResponseDTO }> {
  try {
    await connectToDatabase();

    const askPost = await AskPost.findById(askPostId);
    if (!askPost) {
      throw new Error("AskPost not found");
    }

    const inputContent = askPost.content;

    const fixedContent = await GeminiService.fixContent(inputContent);

    askPost.fixedByAI = fixedContent;

    const updatedAskPost = await askPost.save();

    const aiHistoryData = new IAIHistory({
      post: new mongoose.Types.ObjectId(askPostId),
      input: inputContent,
      output: fixedContent,
    });

    const aiHistory = await aiHistoryData.save();

    return { fixedPost: updatedAskPost, aiHistory };
  } catch (error) {
    console.error("Error in aiFixAskPost:", error);
    throw error;
  }
}
