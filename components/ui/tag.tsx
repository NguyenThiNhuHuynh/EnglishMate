import React from "react";

interface TagProps {
  content: string;
}

const Tag: React.FC<TagProps> = ({ content }) => {
  return (
    <div className="text-dark300_light300 flex gap-[15px] items-center px-[15px] py-[10px] rounded-full background-light400_dark400">
      <span className="text-[14px] font-medium">{content}</span>
    </div>
  );
};

export default Tag;
