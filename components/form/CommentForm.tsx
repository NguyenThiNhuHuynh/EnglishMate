"use client";

import React, { useRef, useState } from "react";
import Button from "@/components/ui/button";
import TextArea from "../ui/textarea";
import {
  Paperclip,
  Image as ImageIcon,
  Video as VideoIcon,
  File as FileIcon,
  X,
} from "lucide-react";

interface CommentFormProps {
  loading?: boolean;
  onSubmit: (args: { text: string; files: File[] }) => Promise<void>;
}

const CommentForm: React.FC<CommentFormProps> = ({ loading, onSubmit }) => {
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const triggerPicker = () => fileRef.current?.click();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files ? Array.from(e.target.files) : [];
    if (picked.length === 0) return;

    setFiles((prev) => {
      const map = new Map<string, File>();
      [...prev, ...picked].forEach((f) => {
        map.set(`${f.name}-${f.size}-${f.lastModified}`, f);
      });
      return Array.from(map.values());
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileRef.current && files.length === 1) {
      fileRef.current.value = "";
    }
  };

  const kindOf = (f: File): "image" | "video" | "other" => {
    if (f.type.startsWith("image/")) return "image";
    if (f.type.startsWith("video/")) return "video";
    return "other";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payloadText = text.trim();
    if (!payloadText && files.length === 0) return;

    await onSubmit({ text: payloadText, files });
    setText("");
    setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border text-dark100_light100 border-light400_dark400 rounded-lg p-3 space-y-3"
    >
      <TextArea
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
          <button
            type="button"
            onClick={triggerPicker}
            className="inline-flex items-center gap-2 rounded-md border border-light400_dark400 px-3 py-1.5 text-sm hover:opacity-80"
            aria-label="Attach files"
            title="Attach files"
          >
            <Paperclip className="w-4 h-4" />
            <span>Attach</span>
          </button>
        </div>

        <Button
          title={loading ? "Posting..." : "Post"}
          size="small"
          disabled={loading}
          type="submit"
        />
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {files.map((f, i) => {
            const kind = kindOf(f);
            const Icon =
              kind === "image"
                ? ImageIcon
                : kind === "video"
                ? VideoIcon
                : FileIcon;

            return (
              <div
                key={`${f.name}-${f.lastModified}-${i}`}
                className="group flex items-center gap-2 rounded-full border border-light400_dark400 bg-transparent px-2 py-1"
              >
                <Icon className="w-4 h-4 text-dark300_light300" />
                <span className="max-w-[160px] truncate text-xs">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="ml-1 inline-flex items-center justify-center rounded-full p-1 text-dark300_light300 hover:opacity-80"
                  aria-label={`Remove ${f.name}`}
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </form>
  );
};

export default CommentForm;
