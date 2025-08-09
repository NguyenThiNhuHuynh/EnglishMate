import React, { useState, useRef } from "react";
import { uploadAvatar } from "@/lib/services/user.service";

const UploadAvatar = () => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar(e.target.files[0]);
      setError("");

      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!avatar) {
      setError("Please select an image to upload.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", avatar);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to upload an avatar.");
        setLoading(false);
        return;
      }

      const response = await uploadAvatar(formData, token); // Gọi service uploadAvatar

      if (response) {
        setSuccess("Avatar uploaded successfully!");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setError("Failed to upload avatar.");
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <div className="relative">
          <img
            src={
              avatar
                ? URL.createObjectURL(avatar)
                : "https://i.pinimg.com/1200x/08/a8/e9/08a8e9475d2c4ed2e9862742200395db.jpg" // Ảnh mặc định
            }
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 hidden"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
          onClick={handleButtonClick}
        >
          {loading ? "Uploading..." : "Upload Avatar"}
        </button>
      </form>
    </div>
  );
};

export default UploadAvatar;
