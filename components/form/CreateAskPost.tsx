"use client";
import React, { useRef, useState } from "react";
import Button from "@/components/ui/button";
import TextArea from "@/components/ui/textarea";
import Input from "@/components/ui/input";
import ModalContainer from "../container/modalContainer";
import { createAskPost } from "@/lib/services/ask.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Paperclip,
  Image as ImageIcon,
  Video as VideoIcon,
  File as FileIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateAskPostProps {
  onClose: () => void;
  onCreated?: () => void;
}

const CreateAskPost: React.FC<CreateAskPostProps> = ({
  onClose,
  onCreated,
}) => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement | null>(null);

  const addTagsFromInput = () => {
    const parts = tagInput
      .split(",")
      .map((t) => t.replace(/^#/, "").trim())
      .filter(Boolean);
    if (parts.length === 0) return;

    setTags((prev) => {
      const set = new Set(prev.map((t) => t.toLowerCase()));
      const merged = [...prev];
      parts.forEach((p) => {
        if (!set.has(p.toLowerCase())) merged.push(p);
      });
      return merged;
    });
    setTagInput("");
  };

  const removeTag = (t: string) =>
    setTags((prev) => prev.filter((x) => x !== t));

  const triggerPicker = () => fileRef.current?.click();

  const kindOf = (f: File): "image" | "video" | "other" => {
    if (f.type.startsWith("image/")) return "image";
    if (f.type.startsWith("video/")) return "video";
    return "other";
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files ? Array.from(e.target.files) : [];
    if (picked.length === 0) return;

    setFiles((prev) => {
      const map = new Map<string, File>();
      [...prev, ...picked].forEach((f) =>
        map.set(`${f.name}-${f.size}-${f.lastModified}`, f)
      );
      return Array.from(map.values());
    });
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    if (fileRef.current && files.length === 1) fileRef.current.value = "";
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!content.trim() && files.length === 0) {
      setError("Hãy nhập nội dung hoặc chọn media.");
      return;
    }

    const form = new FormData();
    form.append("content", content.trim());
    tags.forEach((t) => form.append("tags", t));
    files.forEach((f) => form.append("media", f));

    const res = await createAskPost(form, setLoading, setError);
    if (res) {
      onClose();
      onCreated?.();
      router.refresh();
    }
  };

  return (
    <ModalContainer className="text-dark100_light100 md:w-2/3 lg:w-1/2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Create Ask Post</h2>
        <Icon
          icon="ic:round-close"
          className="size-6 cursor-pointer"
          onClick={onClose}
        />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <TextArea
          placeholder="Enter your content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div>
          <label className="text-sm text-dark300_light300">Tags</label>
          <div className="mt-2 flex items-center gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onBlur={addTagsFromInput}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTagsFromInput();
                }
              }}
              placeholder="Type a tag and press Enter"
            />
            <Button
              title="Add"
              size="small"
              type="button"
              onClick={addTagsFromInput}
            />
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full border border-border-100 px-3 py-1 text-xs"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="text-dark300_light300 hover:opacity-80"
                    aria-label={`Remove ${t}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm text-dark300_light300">Media</label>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFiles}
                className="hidden w-"
              />
              <button
                type="button"
                onClick={triggerPicker}
                className="inline-flex items-center gap-2 rounded-md border border-light400_dark400 text-dark100_light100 px-3 py-1.5 text-sm hover:opacity-80"
              >
                <Paperclip className="w-4 h-4" />
                Attach
              </button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((f, i) => {
                const kind = kindOf(f);
                const IconCmp =
                  kind === "image"
                    ? ImageIcon
                    : kind === "video"
                    ? VideoIcon
                    : FileIcon;
                return (
                  <div
                    key={`${f.name}-${f.lastModified}-${i}`}
                    className="group flex items-center gap-2 rounded-full border border-border-100 px-2 py-1"
                  >
                    <IconCmp className="w-4 h-4 text-dark300_light300" />
                    <span className="max-w-[160px] truncate text-xs">
                      {f.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="ml-1 inline-flex items-center justify-center rounded-full p-1 text-dark300_light300 hover:opacity-80"
                      aria-label={`Remove ${f.name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex justify-end w-full mt-4">
            <Button
              title={loading ? "Creating..." : "Create Post"}
              size="small"
              disabled={loading}
              type="submit"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </ModalContainer>
  );
};

export default CreateAskPost;
