import AskPost, { IAskPost } from "@/database/ask.model";
import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import { AskPostResponseDTO, CreateAskPostDTO } from "@/dtos/ask.dto";
import mongoose, { Types } from "mongoose";

export async function createAskPost(
  params: CreateAskPostDTO
): Promise<AskPostResponseDTO> {
  try {
    await connectToDatabase();

    const askPostData: Partial<IAskPost> = {
      content: params.content,
      fixedByAI: undefined,
      author:
        typeof params.author === "string"
          ? new mongoose.Types.ObjectId(params.author)
          : params.author,
      tags: params.tags || [],
      audioUrl: params.audioUrl || undefined,
      media: (params.media || []).map((url) => ({
        url,
        type: url.match(/\.(mp4|mov|avi|mkv)$/i) ? "video" : "image",
      })),
      status: "pending",
    };

    const newAskPost = await AskPost.create(askPostData);

    const populatedAskPost = await AskPost.findById(newAskPost._id).populate({
      path: "author",
      select: "_id firstName lastName avatar",
    });

    if (!populatedAskPost) {
      throw new Error("Failed to create AskPost");
    }

    const result: AskPostResponseDTO = {
      _id: populatedAskPost._id.toString(),
      content: populatedAskPost.content,
      fixedByAI: populatedAskPost.fixedByAI || undefined,
      author: {
        _id: populatedAskPost.author._id.toString(),
        firstName: populatedAskPost.author.firstName,
        lastName: populatedAskPost.author.lastName,
        avatar: populatedAskPost.author.avatar,
      },
      tags: populatedAskPost.tags || [],
      audioUrl: populatedAskPost.audioUrl || undefined,
      media: (populatedAskPost.media || []).map((m: any) => m.url),
      status: populatedAskPost.status,
      createdAt: populatedAskPost.createdAt.toISOString(),
      updatedAt: populatedAskPost.updatedAt.toISOString(),
    };

    return result;
  } catch (error) {
    console.error("Error in createAskPost:", error);
    throw error;
  }
}
