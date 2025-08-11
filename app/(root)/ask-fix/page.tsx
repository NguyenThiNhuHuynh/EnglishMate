"use client";
import AskPostCard from "@/components/card/AskPostCard";
import PageContainer from "@/components/container/pageContainer";
import CreateAskPost from "@/components/form/CreateAskPost";
import Button from "@/components/ui/button";
import { AskPostResponseDTO } from "@/dtos/ask.dto";
import { getAllAskPost } from "@/lib/services/ask.service";
import { fetchUser } from "@/lib/services/user.service";
import React, { useEffect, useState, useRef, useCallback } from "react";

const Page = () => {
  const [posts, setPosts] = useState<AskPostResponseDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(
    undefined
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const didLoadFirstPageRef = useRef(false);

  useEffect(() => {
    (async () => {
      const u = await fetchUser(() => {});
      if (u?._id) setCurrentUserId(u._id);
    })();
  }, []);

  const mergeUniqueById = (
    prev: AskPostResponseDTO[],
    next: AskPostResponseDTO[]
  ) => {
    const map = new Map<string, AskPostResponseDTO>();
    for (const p of prev) map.set(p._id, p);
    for (const p of next) if (!map.has(p._id)) map.set(p._id, p);
    return Array.from(map.values());
  };

  const fetchPosts = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      if (page === 1 && didLoadFirstPageRef.current) {
        setLoading(false);
        isFetchingRef.current = false;
        return;
      }
      const data = await getAllAskPost(page, 10, setError);
      if (data) {
        setPosts((prev) => mergeUniqueById(prev, data.posts));
        setTotal(data.total);
      }
      if (page === 1) didLoadFirstPageRef.current = true;
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (loading) return;
        if (posts.length >= total) return;
        setPage((prev) => prev + 1);
      },
      { rootMargin: "200px" }
    );
    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [loading, posts.length, total]);

  const handleCreated = useCallback(() => {
    setPosts([]);
    setTotal(0);
    setError("");
    didLoadFirstPageRef.current = false;
    if (page === 1) {
      fetchPosts();
    } else {
      setPage(1);
    }
  }, [page, fetchPosts]);

  const handleDeleted = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setTotal((t) => Math.max(t - 1, 0));
  }, []);

  const handleOpenCreate = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("You must be logged in to create a post.");
      return;
    }
    setError("");
    setIsModalOpen(true);
  };

  if (loading && page === 1 && posts.length === 0) {
    return <div>Loading...</div>;
  }

  if (error && !isModalOpen) {
    return (
      <PageContainer>
        <div className="text-red-500">{error}</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex justify-between items-center pt-8 md:pt-0">
        <h1 className="text-xl font-bold text-dark100_light100">Ask Posts</h1>
        <Button title="Add Post" size="small" onClick={handleOpenCreate} />
      </div>

      {error && isModalOpen === false && (
        <div className="text-red-500 mt-2">{error}</div>
      )}

      <div className="lg:w-1/2 w-full flex flex-col gap-5 mx-auto">
        {posts.map((post) => (
          <AskPostCard
            key={post._id}
            post={post}
            currentUserId={currentUserId}
            onDeleted={handleDeleted}
          />
        ))}
      </div>

      {loading && posts.length > 0 && (
        <div className="text-center">Loading more...</div>
      )}

      <div ref={loadMoreRef} />

      {isModalOpen && (
        <CreateAskPost
          onClose={() => setIsModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </PageContainer>
  );
};

export default Page;
