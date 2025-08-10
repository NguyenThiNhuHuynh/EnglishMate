"use client";

import React from "react";
import { AskPostResponseDTO } from "@/dtos/ask.dto";
import CardContainer from "../container/cardContainer";
import Tag from "../ui/tag";
import { MessageSquare } from "lucide-react";

interface AskPostCardProps {
  post: AskPostResponseDTO & { commentCount?: number };
}

const PostMediaGrid: React.FC<{ media: string[]; postId: string }> = ({
  media,
  postId,
}) => {
  const count = media.length;
  if (!count) return null;

  if (count === 1) {
    return (
      <div className="mt-2">
        <img
          src={media[0]}
          alt="Post media"
          className="w-full max-h-[520px] rounded-lg object-cover"
        />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="mt-2 grid grid-cols-2 gap-2">
        {media.slice(0, 2).map((src, i) => (
          <div
            key={`${postId}-m-${i}`}
            className="relative aspect-square sm:aspect-video"
          >
            <img
              src={src}
              alt="Post media"
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="mt-2 grid grid-cols-3 grid-rows-2 gap-2">
        <div className="relative col-span-2 row-span-2">
          <img
            src={media[0]}
            alt="Post media"
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
        <div className="relative">
          <img
            src={media[1]}
            alt="Post media"
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
        <div className="relative">
          <img
            src={media[2]}
            alt="Post media"
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
      </div>
    );
  }

  const firstFour = media.slice(0, 4);
  const extra = count - 4;

  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      {firstFour.map((src, i) => {
        const isLast = i === 3;
        return (
          <div
            key={`${postId}-m-${i}`}
            className="relative aspect-square sm:aspect-video"
          >
            <img
              src={src}
              alt="Post media"
              className="w-full h-full rounded-lg object-cover"
            />
            {isLast && extra > 0 && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  +{extra}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const DetailAskPostCard: React.FC<AskPostCardProps> = ({ post }) => {
  return (
    <CardContainer className="text-dark100_light100 max-w-full sm:max-w-screen-lg mx-auto">
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

      <p className="mt-2 text-base text-dark100_light100">{post.content}</p>

      {Array.isArray(post.media) && post.media.length > 0 && (
        <PostMediaGrid media={post.media} postId={post._id} />
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

        <div className="ml-auto flex items-center gap-1 text-dark300_light300">
          <MessageSquare className="w-4 h-4" />
          <span>{post.commentCount ?? 0}</span>
        </div>
      </div>
    </CardContainer>
  );
};

export default DetailAskPostCard;
