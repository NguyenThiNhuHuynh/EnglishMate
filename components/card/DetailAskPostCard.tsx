"use client";

import React, { useState } from "react";
import { AskPostResponseDTO } from "@/dtos/ask.dto";
import CardContainer from "../container/cardContainer";
import Tag from "../ui/tag";
import { MessageSquare } from "lucide-react";
import MediaGrid from "../shared/other/MediaGrid";
import { aiFixAskPost } from "@/lib/services/ai-history.service";
import Button from "../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

interface AskPostCardProps {
  post: AskPostResponseDTO & { commentCount?: number };
}

const DetailAskPostCard: React.FC<AskPostCardProps> = ({ post }) => {
  const [fixedText, setFixedText] = useState<string>(post.fixedByAI ?? "");
  const [fixing, setFixing] = useState(false);
  const [err, setErr] = useState("");

  const handleAIFix = async () => {
    setErr("");
    const res = await aiFixAskPost(
      post._id,
      (m) => setErr(m),
      (b) => setFixing(b)
    );
    if (res?.fixedPost?.fixedByAI) {
      setFixedText(res.fixedPost.fixedByAI);
    }
  };

  return (
    <CardContainer className="text-dark100_light100 w-full sm:max-w-screen-lg mx-auto">
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
        <MediaGrid images={post.media} idKey={post._id} singleAspect="video" />
      )}

      <div className="mt-3 text-dark100_light100">
        {fixedText ? (
          <div className="border border-light400_dark400 rounded-lg p-3">
            <p className="text-sm font-semibold text-primary-100">AI FIX</p>
            <p className="mt-1 whitespace-pre-wrap">{fixedText}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAIFix}
              disabled={fixing}
              title={fixing ? "Fixing..." : "Ask AI to fix"}
              size="small"
            />

            {err && <span className="text-red-500 text-sm">{err}</span>}
          </div>
        )}
      </div>

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

        <div className="ml-auto flex items-center gap-1 text-dark100_light100">
          <Icon icon="iconamoon:comment" className="size-[24px]" />
          <span>{post.commentCount ?? 0}</span>
        </div>
      </div>
    </CardContainer>
  );
};

export default DetailAskPostCard;
