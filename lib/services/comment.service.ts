export const getCommentsByPost = async (
  postId: string,
  page: number = 1,
  limit: number = 10,
  setError?: (msg: string) => void
) => {
  try {
    const params = new URLSearchParams({
      postId,
      page: String(page),
      limit: String(limit),
    });

    const res = await fetch(`/api/comment/by-post?${params.toString()}`, {
      method: "GET",
    });

    const data = await res.json();
    if (!res.ok) {
      setError?.(data.message || "Failed to fetch comments");
      return;
    }

    return data;
  } catch (err) {
    console.error("Failed to fetch comments", err);
    setError?.("Failed to fetch comments");
  }
};

import type { CommentResponseDTO } from "@/dtos/comment.dto";

export const createComment = async (
  params: { postId: string; text: string; files?: File[] },
  setError: (msg: string) => void,
  setLoading?: (loading: boolean) => void
): Promise<CommentResponseDTO | undefined> => {
  try {
    setLoading?.(true);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Authentication is required");
      setLoading?.(false);
      return;
    }

    const form = new FormData();
    form.append("post", params.postId);
    form.append("text", params.text);
    (params.files ?? []).forEach((f) => form.append("media", f));

    const res = await fetch("/api/comment/create", {
      method: "POST",
      headers: { Authorization: `${token}` }, // IMPORTANT: KHÔNG set Content-Type khi dùng FormData
      body: form,
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data?.message || "Failed to create comment");
      setLoading?.(false);
      return;
    }

    setLoading?.(false);
    return data as CommentResponseDTO; // API trả về comment vừa tạo
  } catch (err) {
    console.error("Failed to create comment", err);
    setError("Failed to create comment");
    setLoading?.(false);
  }
};

export const deleteComment = async (
  commentId: string,
  setError: (msg: string) => void,
  setLoading?: (loading: boolean) => void
): Promise<{ success: boolean; message: string }> => {
  try {
    setLoading?.(true);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setLoading?.(false);
      return { success: false, message: "Authentication is required" };
    }

    const res = await fetch("/api/comment/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ commentId }),
    });

    const data = await res.json();
    setLoading?.(false);

    if (!res.ok) {
      setError(data?.message || "Failed to delete comment");
      return {
        success: false,
        message: data?.message || "Failed to delete comment",
      };
    }

    return { success: true, message: data?.message || "Comment deleted" };
  } catch (err) {
    console.error("Failed to delete comment", err);
    setLoading?.(false);
    return { success: false, message: "Failed to delete comment" };
  }
};

export const voteComment = async (
  commentId: string,
  action: "upvote" | "downvote",
  setError: (msg: string) => void,
  setLoading?: (loading: boolean) => void
): Promise<{ success: boolean; message: string }> => {
  try {
    setLoading?.(true);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setLoading?.(false);
      return { success: false, message: "Authentication is required" };
    }

    const res = await fetch("/api/comment/up-down-vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ commentId, action }),
    });

    const data = await res.json();
    setLoading?.(false);

    if (!res.ok) {
      setError(data?.message || "Failed to vote");
      return { success: false, message: data?.message || "Failed to vote" };
    }

    return { success: true, message: data?.message || "Vote recorded" };
  } catch (err) {
    console.error("Failed to vote comment", err);
    setLoading?.(false);
    return { success: false, message: "Failed to vote" };
  }
};
