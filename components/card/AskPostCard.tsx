import { AskPostResponseDTO } from "@/dtos/ask.dto";
import React from "react";
import CardContainer from "../container/cardContainer";
import Tag from "../ui/tag";

interface AskPostCardProps {
  post: AskPostResponseDTO;
}

const AskPostCard: React.FC<AskPostCardProps> = ({ post }) => {
  return (
    <CardContainer
      className="text-dark100_light100 max-w-full sm:max-w-screen-lg mx-auto" // Đặt max-width để ngăn card mở rộng quá mức
    >
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

      <p className="text-base text-dark100_light100">{post.content}</p>

      {post.media && post.media.length > 0 && (
        <div>
          {post.media.map((mediaUrl, index) => (
            <img
              key={index}
              src={mediaUrl}
              alt="Post media"
              className="w-full h-auto rounded-lg"
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-sm">
        {post.tags && post.tags.length > 0 && (
          <div>
            {post.tags.map((tag, index) => (
              <Tag key={index} content={`#${tag}`} />
            ))}
          </div>
        )}

        {post.audioUrl && (
          <audio controls className="ml-3">
            <source src={post.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </CardContainer>
  );
};

export default AskPostCard;
