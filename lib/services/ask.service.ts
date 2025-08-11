import { AskPostResponseDTO } from "@/dtos/ask.dto";

export const getAllAskPost = async (
  page: number = 1,
  limit: number = 10,
  setError: (msg: string) => void
) => {
  try {
    const res = await fetch(`/api/ask/all?page=${page}&limit=${limit}`);

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    return data;
  } catch (error) {
    setError("Failed to fetch ask posts");
  }
};

export const createAskPost = async (
  data: FormData,
  setLoading: (loading: boolean) => void,
  setError: (msg: string) => void
) => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication is required");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/ask/create", {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
      body: data,
    });

    const responseData = await res.json();

    if (!res.ok) {
      setError(responseData.message || "Failed to create ask post");
      setLoading(false);
      return;
    }

    setLoading(false);
    return responseData;
  } catch (error) {
    console.error("Error creating ask post:", error);
    setError("Failed to create ask post");
    setLoading(false);
  }
};

export const getAskPostById = async (
  id: string,
  setError: (msg: string) => void
): Promise<AskPostResponseDTO | undefined> => {
  try {
    const res = await fetch(`/api/ask/detail?id=${encodeURIComponent(id)}`, {
      method: "GET",
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Failed to fetch ask post");
      return;
    }

    return data.post as AskPostResponseDTO;
  } catch (error) {
    console.error("Failed to fetch ask post by id:", error);
    setError("Failed to fetch ask post");
  }
};

export const deleteAskPost = async (
  postId: string,
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

    const res = await fetch("/api/ask/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ postId }),
    });

    const data = await res.json();
    setLoading?.(false);

    if (!res.ok) {
      setError(data?.message || "Failed to delete ask post");
      return {
        success: false,
        message: data?.message || "Failed to delete ask post",
      };
    }

    return { success: true, message: data?.message || "Post deleted" };
  } catch (err) {
    console.error("Failed to delete ask post", err);
    setLoading?.(false);
    return { success: false, message: "Failed to delete ask post" };
  }
};
