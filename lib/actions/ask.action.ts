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

// export async function getAllAskPost(
//   page: number = 1,
//   limit: number = 10
// ): Promise<{ posts: AskPostResponseDTO[]; total: number }> {
//   try {
//     await connectToDatabase();

//     const skip = (page - 1) * limit;

//     const [posts, total] = await Promise.all([
//       AskPost.find()
//         .skip(skip)
//         .limit(limit)
//         .populate({
//           path: "author",
//           select: "_id firstName lastName avatar",
//         })
//         .sort({ createdAt: -1 }),
//       AskPost.countDocuments(),
//     ]);

//     const result: AskPostResponseDTO[] = posts.map((post) => ({
//       _id: post._id.toString(),
//       content: post.content,
//       fixedByAI: post.fixedByAI || undefined,
//       author: {
//         _id: post.author._id.toString(),
//         firstName: post.author.firstName,
//         lastName: post.author.lastName,
//         avatar: post.author.avatar,
//       },
//       tags: post.tags || [],
//       audioUrl: post.audioUrl || undefined,
//       media: (post.media || []).map((m: any) => m.url),
//       status: post.status,
//       createdAt: post.createdAt.toISOString(),
//       updatedAt: post.updatedAt.toISOString(),
//     }));

//     return { posts: result, total };
//   } catch (error) {
//     console.error("Error in getAllAskPost:", error);
//     throw error;
//   }
// }

export async function getAllAskPost(
  page: number = 1,
  limit: number = 10
): Promise<{ posts: AskPostResponseDTO[]; total: number }> {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    const [docs, totalArr] = await Promise.all([
      AskPost.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },

        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },

        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "post",
            as: "comments",
          },
        },
        { $addFields: { commentCount: { $size: "$comments" } } },

        {
          $project: {
            comments: 0,
            "author.password": 0,
            "author.email": 0,
          },
        },
      ]),
      AskPost.countDocuments(),
    ]);

    const posts: AskPostResponseDTO[] = docs.map((p: any) => ({
      _id: p._id.toString(),
      content: p.content,
      fixedByAI: p.fixedByAI || undefined,
      author: {
        _id: p.author?._id?.toString() ?? "",
        firstName: p.author?.firstName ?? "",
        lastName: p.author?.lastName ?? "",
        avatar: p.author?.avatar ?? "",
      },
      tags: p.tags || [],
      audioUrl: p.audioUrl || undefined,
      media: Array.isArray(p.media) ? p.media.map((m: any) => m.url) : [],
      status: p.status,
      createdAt:
        p.createdAt instanceof Date
          ? p.createdAt.toISOString()
          : String(p.createdAt),
      updatedAt:
        p.updatedAt instanceof Date
          ? p.updatedAt.toISOString()
          : String(p.updatedAt),

      commentCount: typeof p.commentCount === "number" ? p.commentCount : 0,
    }));

    const total = Array.isArray(totalArr) ? (totalArr as any) : totalArr;
    return { posts, total };
  } catch (error) {
    console.error("Error in getAllAskPost:", error);
    throw error;
  }
}

export async function getAskPostById(
  id: string
): Promise<AskPostResponseDTO & { commentCount: number }> {
  try {
    await connectToDatabase();

    if (!id || !Types.ObjectId.isValid(id)) {
      throw new Error("Invalid post id");
    }

    const [doc] = await AskPost.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },

      // Join tác giả
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },

      // Đếm comment
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      { $addFields: { commentCount: { $size: "$comments" } } },

      // Ẩn trường không cần thiết
      {
        $project: {
          comments: 0,
          "author.password": 0,
          "author.email": 0,
        },
      },
      // (không cần $limit vì match 1 id)
    ]);

    if (!doc) throw new Error("Post not found");

    const result: AskPostResponseDTO & { commentCount: number } = {
      _id: doc._id.toString(),
      content: doc.content,
      fixedByAI: doc.fixedByAI || undefined,
      author: {
        _id: doc.author?._id?.toString() ?? "",
        firstName: doc.author?.firstName ?? "",
        lastName: doc.author?.lastName ?? "",
        avatar: doc.author?.avatar ?? "",
      },
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      audioUrl: doc.audioUrl || undefined,
      media: Array.isArray(doc.media) ? doc.media.map((m: any) => m.url) : [],
      status: doc.status,
      createdAt:
        doc.createdAt instanceof Date
          ? doc.createdAt.toISOString()
          : String(doc.createdAt),
      updatedAt:
        doc.updatedAt instanceof Date
          ? doc.updatedAt.toISOString()
          : String(doc.updatedAt),

      // bổ sung cho thống nhất với getAll
      commentCount: typeof doc.commentCount === "number" ? doc.commentCount : 0,
    };

    return result;
  } catch (err) {
    console.error("Error in getAskPostById:", err);
    throw err;
  }
}
