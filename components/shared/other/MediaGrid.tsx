"use client";

import React from "react";
import { cn } from "@/lib/utils";

type SingleAspect = "video" | "square" | `${number}/${number}`;

export interface MediaGridProps {
  images: string[];
  idKey: string; // unique id cho item (postId/commentId)
  className?: string; // thêm class ngoài nếu cần
  /** Tỉ lệ cho trường hợp 1 ảnh: "video" = 16/9 (mặc định), "square" = 1/1, hoặc "3/2", "4/3", ... */
  singleAspect?: SingleAspect;
  /** Số ảnh tối đa hiển thị trước khi overlay +N (mặc định 4) */
  displayLimit?: number;
}

/** MediaGrid: hiển thị ảnh 1/2/3/≥4 theo bố cục giống Facebook */
const MediaGrid: React.FC<MediaGridProps> = ({
  images,
  idKey,
  className,
  singleAspect = "video",
  displayLimit = 4,
}) => {
  const count = images.length;
  if (!count) return null;

  const getAspectValue = (aspect: SingleAspect): string => {
    if (aspect === "video") return "16/9";
    if (aspect === "square") return "1/1";
    return aspect; // ví dụ "3/2"
  };

  // 1 ảnh: giữ chiều cao đồng đều bằng aspect-ratio + object-cover
  if (count === 1) {
    const aspect = getAspectValue(singleAspect);
    return (
      <div
        className={cn(
          "mt-2 relative w-full overflow-hidden rounded-lg",
          className
        )}
        style={{ aspectRatio: aspect }}
      >
        <img
          src={images[0]}
          alt="media"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  // 2 ảnh: chia đôi
  if (count === 2) {
    return (
      <div className={cn("mt-2 grid grid-cols-2 gap-2", className)}>
        {images.slice(0, 2).map((src, i) => (
          <div
            key={`${idKey}-m-${i}`}
            className="relative aspect-square sm:aspect-video overflow-hidden rounded-lg"
          >
            <img src={src} alt="media" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    );
  }

  // 3 ảnh: 1 lớn bên trái, 2 ảnh xếp dọc bên phải
  if (count === 3) {
    return (
      <div className={cn("mt-2 grid grid-cols-3 grid-rows-2 gap-2", className)}>
        <div className="relative col-span-2 row-span-2 overflow-hidden rounded-lg">
          <img
            src={images[0]}
            alt="media"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={images[1]}
            alt="media"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={images[2]}
            alt="media"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    );
  }

  // ≥4 ảnh: lưới 2x2, ô cuối overlay +N nếu còn dư
  const firstN = images.slice(0, displayLimit);
  const extra = count - displayLimit;

  return (
    <div className={cn("mt-2 grid grid-cols-2 gap-2", className)}>
      {firstN.map((src, i) => {
        const isLast = i === displayLimit - 1;
        return (
          <div
            key={`${idKey}-m-${i}`}
            className="relative aspect-square sm:aspect-video overflow-hidden rounded-lg"
          >
            <img src={src} alt="media" className="h-full w-full object-cover" />
            {isLast && extra > 0 && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
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

export default MediaGrid;
