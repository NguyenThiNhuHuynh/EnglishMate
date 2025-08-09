"use client";
import AskPostCard from "@/components/card/AskPostCard";
import PageContainer from "@/components/container/pageContainer";
import CreateAskPost from "@/components/form/CreateAskPost";
import Button from "@/components/ui/button";
import { AskPostResponseDTO } from "@/dtos/ask.dto";
import { getAllAskPost } from "@/lib/services/ask.service";
import React, { useEffect, useState, useRef } from "react";

const Page = () => {
  const [posts, setPosts] = useState<AskPostResponseDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const data = await getAllAskPost(page, 10, setError);

    if (data) {
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setTotal(data.total);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          if (posts.length < total) {
            setPage((prevPage) => prevPage + 1);
          }
        }
      },
      {
        rootMargin: "200px",
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loading, posts.length, total]);

  if (loading && page === 1) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-dark100_light100">Ask Posts</h1>
        <Button
          title="Add Post"
          size="small"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <div className="lg:w-1/2 w-full flex flex-col gap-5">
        {posts.map((post: AskPostResponseDTO) => (
          <AskPostCard key={post._id} post={post} />
        ))}
      </div>

      {loading && <div className="text-center">Loading more...</div>}

      <div ref={loadMoreRef} />

      {isModalOpen && <CreateAskPost onClose={() => setIsModalOpen(false)} />}
    </PageContainer>
  );
};

export default Page;
