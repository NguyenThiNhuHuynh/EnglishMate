import type { AskPostResponseDTO } from "@/dtos/ask.dto";
import type { AIHistoryResponseDTO } from "@/dtos/ai-history.dto";

export const aiFixAskPost = async (
  id: string,
  setError: (msg: string) => void,
  setLoading?: (loading: boolean) => void
): Promise<
  { fixedPost: AskPostResponseDTO; aiHistory: AIHistoryResponseDTO } | undefined
> => {
  try {
    setLoading?.(true);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setLoading?.(false);
      setError("You need to login first");
      return;
    }

    const res = await fetch(`/api/ask/ai-fix?id=${encodeURIComponent(id)}`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
    });

    const data = await res.json();
    setLoading?.(false);

    if (!res.ok) {
      setError(data?.message || "Failed to AI-fix the post");
      return;
    }

    return data as {
      fixedPost: AskPostResponseDTO;
      aiHistory: AIHistoryResponseDTO;
    };
  } catch (e) {
    console.error("aiFixAskPost error:", e);
    setLoading?.(false);
    setError("Failed to AI-fix the post");
  }
};
