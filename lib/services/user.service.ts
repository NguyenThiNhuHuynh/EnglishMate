import { LoginDTO } from "@/dtos/user.dto";

export const handleLogin = async (
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
    return data;
  } catch (err) {
    setError("Có lỗi xảy ra, vui lòng thử lại");
  }
};

import { RegisterDTO } from "@/dtos/user.dto";

export const handleRegister = async (
  {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    confirmPassword,
  }: RegisterDTO,
  setError: (msg: string) => void,
  setSuccess: (msg: string) => void
) => {
  try {
    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      role: "student",
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    setSuccess("Registration successful! Redirecting...");
    return data;
  } catch (err) {
    setError("Có lỗi xảy ra, vui lòng thử lại");
  }
};

export const fetchUser = async (setError: (msg: string) => void) => {
  const token = localStorage.getItem("token");

  if (!token) {
    setError("You need to login first");
    return;
  }

  try {
    const res = await fetch("/api/user/fetch-user", {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    return data.userData;
  } catch (error) {
    setError("Failed to fetch user data");
  }
};

export async function uploadAvatar(formData: FormData, token: string | null) {
  try {
    const response = await fetch("/api/user/upload-avatar", {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to upload avatar", err);
    throw err;
  }
}

export async function updateUserBio(
  params: { bio: string },
  token: string | null
) {
  try {
    const response = await fetch(`/api/user/update-bio`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Error update bio");
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to update bio", err);
  }
}
