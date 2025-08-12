"use client";

import React, { useState, useRef } from "react";
import { uploadAvatar } from "@/lib/services/user.service";
import Button from "../ui/button";

type UploadAvatarProps = {
  avatarUrl?: string;
  onUploaded?: (url: string) => void;
};

const UploadAvatar: React.FC<UploadAvatarProps> = ({
  avatarUrl,
  onUploaded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pickFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
    setSuccess("");

    await doUpload(f);
  };

  const doUpload = async (f: File) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to upload an avatar.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", f);

      const res = await uploadAvatar(formData, token);
      // Tùy API trả về trường nào
      const url =
        (res as any)?.avatar ||
        (res as any)?.avatarUrl ||
        (res as any)?.url ||
        "";

      if (url) {
        setSuccess("Avatar uploaded successfully!");
        onUploaded?.(url);
      } else {
        setSuccess("Uploaded. Please refresh to see the new avatar.");
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setError("Failed to upload avatar.");
    } finally {
      setLoading(false);
    }
  };

  const displaySrc = preview || avatarUrl || "/default-avatar.png";

  return (
    <div>
      <div className="flex justify-center mb-4">
        <div className="relative">
          <img
            src={displaySrc}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
          />
        </div>
      </div>

      <div className="text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <Button
          title={loading ? "Uploading..." : "Upload Avatar"}
          size="small"
          onClick={pickFile}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default UploadAvatar;
