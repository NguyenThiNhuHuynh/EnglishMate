"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAskPostById } from "@/lib/services/ask.service";
import { getCommentsByPost } from "@/lib/services/comment.service";
import {
  createComment as createCommentSvc,
  deleteComment as deleteCommentSvc,
  voteComment as voteCommentSvc,
} from "@/lib/services/comment.service";
import type { AskPostResponseDTO } from "@/dtos/ask.dto";
import type { CommentResponseDTO } from "@/dtos/comment.dto";
import PageContainer from "@/components/container/pageContainer";
import Button from "@/components/ui/button";
import CommentCard from "@/components/card/CommentCard";
import CommentForm from "@/components/form/CommentForm";
import { fetchUser } from "@/lib/services/user.service";
import DetailAskPostCard from "@/components/card/DetailAskPostCard";

export default function AskFixDetailPage() {
  const { id }: any = useParams<{ id: string }>();
  const router = useRouter();

  const [post, setPost] = useState<
    (AskPostResponseDTO & { commentCount?: number }) | null
  >(null);
  const [comments, setComments] = useState<CommentResponseDTO[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(
    undefined
  );
  const [currentUserRole, setCurrentUserRole] = useState<string | undefined>(
    undefined
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    (async () => {
      const u = await fetchUser(() => {});
      if (u?._id) setCurrentUserId(u._id);
      if (u?.role) setCurrentUserRole(u.role);
    })();
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!id) return;
      const p = await getAskPostById(id, setError);
      if (!ignore) setPost(p ?? null);
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  const loadComments = useCallback(async () => {
    if (!id || isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const data = await getCommentsByPost(id, page, 10, setError);
      if (data) {
        setComments((prev) => [...prev, ...data.comments]);
        setHasMore(data.hasMore);
        setPage((prev) => prev + 1);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [id, page, hasMore]);

  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
    setError("");
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    loadComments();
  }, [id, loadComments]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) loadComments();
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => {
      obs.unobserve(el);
      obs.disconnect();
    };
  }, [loadComments]);

  const handleCreate = async ({
    text,
    files,
  }: {
    text: string;
    files: File[];
  }) => {
    if (!id) return;
    const created = await createCommentSvc(
      { postId: id, text, files },
      (m) => setError(m),
      (b) => setPosting(b)
    );
    if (created) {
      setComments((prev) => [...prev, created]);
      setPost((prev) =>
        prev ? { ...prev, commentCount: (prev.commentCount ?? 0) + 1 } : prev
      );
    }
  };

  const handleDelete = async (commentId: string) => {
    const res = await deleteCommentSvc(commentId, (m) => setError(m));
    if (res?.success) {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setPost((prev) =>
        prev
          ? { ...prev, commentCount: Math.max((prev.commentCount ?? 1) - 1, 0) }
          : prev
      );
    }
  };

  const handleVote = async (
    commentId: string,
    action: "upvote" | "downvote"
  ) => {
    if (!currentUserId) return;
    setComments((prev) =>
      prev.map((c) => {
        if (c._id !== commentId) return c;
        const up = new Set(c.upVotes ?? []);
        const down = new Set(c.downVotes ?? []);
        if (action === "upvote") {
          if (!up.has(currentUserId)) {
            up.add(currentUserId);
            down.delete(currentUserId);
          }
        } else {
          if (!down.has(currentUserId)) {
            down.add(currentUserId);
            up.delete(currentUserId);
          }
        }
        return { ...c, upVotes: Array.from(up), downVotes: Array.from(down) };
      })
    );

    const res = await voteCommentSvc(commentId, action, (m) => setError(m));
    if (!res?.success) {
      setComments((prev) =>
        prev.map((c) => {
          if (c._id !== commentId) return c;
          const up = new Set(c.upVotes ?? []);
          const down = new Set(c.downVotes ?? []);
          if (action === "upvote") {
            if (up.has(currentUserId)) {
              up.delete(currentUserId);
            }
          } else {
            if (down.has(currentUserId)) {
              down.delete(currentUserId);
            }
          }
          return { ...c, upVotes: Array.from(up), downVotes: Array.from(down) };
        })
      );
    }
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-dark100_light100">Post detail</h1>
        <Button title="Back" size="small" onClick={() => router.back()} />
      </div>

      {post && (
        <div className="lg:w-1/2 w-full flex flex-col gap-5">
          <DetailAskPostCard post={post} />
        </div>
      )}

      <h2 className="text-lg font-semibold text-dark100_light100 mt-4">
        Comments
      </h2>
      {error && <div className="text-red-500">{error}</div>}

      <div className="space-y-4">
        {comments.map((c) => (
          <CommentCard
            key={c._id}
            comment={c}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
            onDelete={handleDelete}
            onVote={handleVote}
          />
        ))}

        {loading && (
          <div className="text-center text-dark100_light100 text-sm py-2">
            Loading...
          </div>
        )}
        {hasMore && <div ref={sentinelRef} className="h-6" />}
        {!loading && !hasMore && comments.length === 0 && (
          <div className="text-center text-sm text-dark300_light300">
            No comments yet.
          </div>
        )}
      </div>
      <div className="">
        <CommentForm loading={posting} onSubmit={handleCreate} />
      </div>
    </PageContainer>
  );
}
