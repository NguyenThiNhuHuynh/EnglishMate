"use client";

import React, { useMemo } from "react";
import type { CommentResponseDTO } from "@/dtos/comment.dto";
import MediaGrid from "@/components/shared/other/MediaGrid";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";

interface CommentCardProps {
  comment: CommentResponseDTO;
  currentUserId?: string;
  onVote?: (id: string, action: "upvote" | "downvote") => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  currentUserId,
  onVote,
  onDelete,
  className,
}) => {
  const youUpvoted = useMemo(
    () => !!currentUserId && (comment.upVotes ?? []).includes(currentUserId),
    [comment.upVotes, currentUserId]
  );

  const youDownvoted = useMemo(
    () => !!currentUserId && (comment.downVotes ?? []).includes(currentUserId),
    [comment.downVotes, currentUserId]
  );

  const canDelete = currentUserId === comment.user._id;

  return (
    <div
      className={cn(
        "border-b-[2px] border-light400_dark400 text-dark100_light100 p-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <img
          src={comment.user.avatar || "/default-avatar.png"}
          alt={`${comment.user.firstName} ${comment.user.lastName}`}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {comment.user.firstName} {comment.user.lastName}
          </p>
          <p className="text-xs text-dark300_light300">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => !youUpvoted && onVote?.(comment._id, "upvote")}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs",
              youUpvoted
                ? "border-primary-100 text-primary-100"
                : "border-border-100 text-dark300_light300 hover:opacity-80"
            )}
            disabled={youUpvoted}
            aria-label="Upvote"
            title={youUpvoted ? "You upvoted" : "Upvote"}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{comment.upVotes?.length ?? 0}</span>
          </button>

          <button
            type="button"
            onClick={() => !youDownvoted && onVote?.(comment._id, "downvote")}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs",
              youDownvoted
                ? "border-red-500 text-red-500"
                : "border-border-100 text-dark300_light300 hover:opacity-80"
            )}
            disabled={youDownvoted}
            aria-label="Downvote"
            title={youDownvoted ? "You downvoted" : "Downvote"}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>{comment.downVotes?.length ?? 0}</span>
          </button>

          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete?.(comment._id)}
              className="inline-flex items-center gap-1 rounded-full border border-border-100 px-2 py-1 text-xs text-dark300_light300 hover:opacity-80"
              aria-label="Delete comment"
              title="Delete comment"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Text */}
      {comment.text && <p className="mt-2 text-sm">{comment.text}</p>}

      {/* Media */}
      {Array.isArray(comment.media) && comment.media.length > 0 && (
        <MediaGrid
          images={comment.media}
          idKey={comment._id}
          singleAspect="video"
        />
      )}
    </div>
  );
};

export default React.memo(CommentCard);
