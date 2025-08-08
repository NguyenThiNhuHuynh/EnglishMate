import { LoginDTO } from "@/dtos/user.dto";

const handleLogin = async (
  { emailOrPhone, password }: LoginDTO,
  setError: (msg: string) => void
) => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailOrPhone: emailOrPhone,
        password: password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    localStorage.setItem("token", data.token);

    console.log("Token:", data.token);
    console.log("Role:", data.role);
  } catch (err) {
    setError("Có lỗi xảy ra, vui lòng thử lại");
  }
};
