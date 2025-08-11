"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AskPostResponseDTO } from "@/dtos/ask.dto";
import CardContainer from "../container/cardContainer";
import Tag from "../ui/tag";
import { Icon } from "@iconify/react/dist/iconify.js";
import MediaGrid from "../shared/other/MediaGrid";
import { deleteAskPost as deleteAskPostSvc } from "@/lib/services/ask.service";
import { Trash2 } from "lucide-react";

interface AskPostCardProps {
  post: AskPostResponseDTO & { commentCount?: number };
  currentUserId?: string;
  onDeleted?: (postId: string) => void;
}

const AskPostCard: React.FC<AskPostCardProps> = ({
  post,
  currentUserId,
  onDeleted,
}) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const isOwner = currentUserId && currentUserId === post.author._id;

  const handleGoComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/ask-fix/${post._id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleting) return;

    const ok = window.confirm("Are you sure you want to delete this post?");
    if (!ok) return;

    setDeleting(true);
    const res = await deleteAskPostSvc(
      post._id,
      (msg) => console.error(msg),
      (b) => setDeleting(b)
    );
    setDeleting(false);

    if (res?.success) {
      onDeleted?.(post._id);
    } else {
      alert(res?.message || "Failed to delete post");
    }
  };

  return (
    <CardContainer className="text-dark100_light100 w-full sm:max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar || "/default-avatar.png"}
            alt={`${post.author.firstName} ${post.author.lastName}`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold">
              {post.author.firstName} {post.author.lastName}
            </p>
            <p className="text-sm text-dark300_light300">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {isOwner && (
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1 rounded-full border border-border-100 px-2 py-1 text-xs text-dark300_light300 hover:opacity-80"
            aria-label="Delete comment"
            title="Delete comment"
            disabled={deleting}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{deleting ? "Deleting..." : "Delete"}</span>
          </button>
        )}
      </div>

      <p className="mt-2 text-base text-dark100_light100">{post.content}</p>

      {Array.isArray(post.media) && post.media.length > 0 && (
        <MediaGrid images={post.media} idKey={post._id} singleAspect="video" />
      )}

      <div className="mt-2 flex items-center gap-4 text-sm">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Tag key={`${post._id}-t-${index}`} content={`#${tag}`} />
            ))}
          </div>
        )}

        {post.audioUrl && (
          <audio controls className="ml-3">
            <source src={post.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}

        <button
          type="button"
          onClick={handleGoComments}
          className="ml-auto flex items-center gap-1 text-dark100_light100 hover:opacity-80 transition"
          aria-label="see comments"
        >
          <Icon icon="iconamoon:comment" className="size-[24px]" />
          <span>{post.commentCount ?? 0}</span>
        </button>
      </div>
    </CardContainer>
  );
};

export default AskPostCard;
