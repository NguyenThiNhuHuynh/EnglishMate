"use client";
import React, { useState, useRef } from "react";
import Button from "@/components/ui/button";
import TextArea from "@/components/ui/textarea";
import Input from "@/components/ui/input";
import { createAskPost } from "@/lib/services/ask.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import ModalContainer from "../container/modalContainer";

interface CreateAskPostProps {
  onClose: () => void;
}

const CreateAskPost = ({ onClose }: CreateAskPostProps) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState("public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setMedia((prev) => [...prev, ...selectedFiles]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tags));
    formData.append("privacy", privacy);

    media.forEach((file) => {
      formData.append("media", file);
    });

    const result = await createAskPost(formData, setLoading, setError);
    if (result) {
      console.log("Created ask post:", result);
      onClose();
    }
  };

  return (
    <ModalContainer className="text-dark100_light100">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Create Ask Post</h2>
        <Icon
          icon="ic:round-close"
          className="size-6 cursor-pointer mr-5 "
          onClick={onClose}
        />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your content"
        />
        <Input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
        />
        <Button type="submit">Create Post</Button>
      </form>
    </ModalContainer>
  );
};

export default CreateAskPost;
