import Comment, { IComment } from "@/database/comment.model";
import { connectToDatabase } from "../mongoose";
import { CreateCommentDTO, CommentResponseDTO } from "@/dtos/comment.dto";
import mongoose from "mongoose";
import { IUser } from "@/database/user.model";

export async function createComment(
  params: CreateCommentDTO
): Promise<CommentResponseDTO> {
  try {
    await connectToDatabase();

    const commentData = {
      post: new mongoose.Types.ObjectId(params.post),
      user: new mongoose.Types.ObjectId(params.user),
      text: params.text,
      upVotes: [],
      downVotes: [],
      media: params.media || [],
    };

    const newComment = await Comment.create(commentData);

    const populatedComment = (await Comment.findById(newComment._id)
      .populate({
        path: "user",
        select: "_id firstName lastName avatar",
      })
      .lean()) as unknown as Omit<IComment, "user" | "post"> & {
      _id: mongoose.Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
      user: IUser & { _id: mongoose.Types.ObjectId };
      post: mongoose.Types.ObjectId;
    };

    if (!populatedComment) {
      throw new Error("Failed to create comment");
    }

    const result: CommentResponseDTO = {
      _id: populatedComment._id.toString(),
      text: populatedComment.text,
      user: {
        _id: populatedComment.user._id.toString(),
        firstName: populatedComment.user.firstName,
        lastName: populatedComment.user.lastName,
        avatar: populatedComment.user.avatar || "",
      },
      post: populatedComment.post.toString(),
      media: populatedComment.media || [],
      upVotes: populatedComment.upVotes.map((id) => id.toString()),
      downVotes: populatedComment.downVotes.map((id) => id.toString()),
      createdAt: (populatedComment.createdAt as Date).toISOString(),
      updatedAt: (populatedComment.updatedAt as Date).toISOString(),
    };

    return result;
  } catch (error) {
    console.error("Error in createComment:", error);
    throw error;
  }
}

export async function upvoteDownvoteComment(
  commentId: string,
  userId: string,
  action: "upvote" | "downvote"
): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return { success: false, message: "Comment not found" };
    }

    if (action === "upvote") {
      if (comment.upVotes.includes(userId)) {
        return { success: false, message: "User already upvoted" };
      }
      comment.upVotes.push(userId);

      if (comment.downVotes.includes(userId)) {
        comment.downVotes = comment.downVotes.filter(
          (id: any) => id.toString() !== userId
        );
      }
    } else if (action === "downvote") {
      if (comment.downVotes.includes(userId)) {
        return { success: false, message: "User already downvoted" };
      }
      comment.downVotes.push(userId);

      if (comment.upVotes.includes(userId)) {
        comment.upVotes = comment.upVotes.filter(
          (id: any) => id.toString() !== userId
        );
      }
    } else {
      return { success: false, message: "Invalid action" };
    }

    await comment.save();

    return { success: true, message: "Vote recorded successfully" };
  } catch (error) {
    console.error("Error in upvoteDownvoteComment:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

export async function deleteComment(
  commentId: string,
  userId: string
): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return { success: false, message: "Comment not found" };
    }

    if (comment.user.toString() !== userId) {
      return {
        success: false,
        message: "You are not authorized to delete this comment",
      };
    }

    await Comment.deleteOne({ _id: commentId });

    return { success: true, message: "Comment deleted successfully" };
  } catch (error) {
    console.error("Error in deleteComment:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

import { Types } from "mongoose";

export async function getCommentsByPost(
  postId: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  comments: CommentResponseDTO[];
  total: number;
  hasMore: boolean;
}> {
  try {
    await connectToDatabase();

    if (!postId || !Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid postId");
    }

    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      Comment.find({ post: postId })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "user",
          select: "_id firstName lastName avatar",
        })
        .lean(),
      Comment.countDocuments({ post: postId }),
    ]);

    const comments: CommentResponseDTO[] = (docs as any[]).map((c) => ({
      _id: c._id.toString(),
      post: (c.post?._id ?? c.post)?.toString?.() || String(c.post),
      text: c.text ?? "",
      media: Array.isArray(c.media) ? c.media : [],
      upVotes: Array.isArray(c.upVotes)
        ? c.upVotes.map((id: any) => id.toString())
        : [],
      downVotes: Array.isArray(c.downVotes)
        ? c.downVotes.map((id: any) => id.toString())
        : [],
      createdAt:
        c.createdAt instanceof Date
          ? c.createdAt.toISOString()
          : String(c.createdAt),
      updatedAt:
        c.updatedAt instanceof Date
          ? c.updatedAt.toISOString()
          : String(c.updatedAt),
      user: {
        _id: c.user?._id?.toString() ?? "",
        firstName: c.user?.firstName ?? "",
        lastName: c.user?.lastName ?? "",
        avatar: c.user?.avatar ?? "",
      },
    }));

    const hasMore = skip + comments.length < total;

    return { comments, total, hasMore };
  } catch (error) {
    console.error("Error in getCommentsByPost:", error);
    throw error;
  }
}
