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
