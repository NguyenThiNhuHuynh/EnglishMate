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
    setLoading(true); // Bắt đầu loading

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication is required");
      setLoading(false);
      return;
    }

    // Gửi yêu cầu POST với FormData
    const res = await fetch("/api/ask/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const responseData = await res.json();

    if (!res.ok) {
      setError(responseData.message || "Failed to create ask post");
      setLoading(false);
      return;
    }

    setLoading(false); // Kết thúc loading
    return responseData;
  } catch (error) {
    console.error("Error creating ask post:", error);
    setError("Failed to create ask post");
    setLoading(false);
  }
};
