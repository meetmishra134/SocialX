import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Post } from "@/types/post.types";

import CommentIcon from "../icons/CommentIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import HeartIcon from "../icons/HeartIcon";
import { useAuth } from "@/store/authStore";
import DOMPurify from "dompurify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { getRelativeTime } from "@/lib/relativeTime";
import { useDeletePost } from "@/hooks/useDeletePost";
import { Link, useNavigate } from "react-router-dom";
import { useComment } from "@/hooks/useComment";
import SharePosts from "./SharePosts";
import { useState } from "react";
import ImagePreview from "../ui/ImagePreview";
import { AnimatePresence } from "motion/react";
import CommentInput from "../comments/CommentInput";

interface PostCardProps {
  post: Post;
  variant?: "detailed" | "feed" | "profile";
}

const PostCard = ({ post, variant }: PostCardProps) => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [focusTrigger, setFocusTrigger] = useState(0);
  const { user } = useAuth();
  const { mutate: deletePost } = useDeletePost();
  const hasMultipleImages = (post?.images?.length ?? 0) > 1;
  const { data } = useComment(post?._id, !!post);
  const comments = data?.pages.flatMap((page) => page.comments) || [];
  const hasSingleImage = post?.images && (post.images?.length ?? 0) === 1;
  const previewImages = (post?.images ?? []).map((image) =>
    typeof image === "string" ? image : image.url,
  );
  const navigate = useNavigate();
  const isAuthor = user?._id === post?.author._id;
  const rawText = post?.text || "";
  const trimmedText = rawText.replace(/(<p><br><\/p>)+$/g, "");
  const safeHTML = DOMPurify.sanitize(trimmedText);
  const postTitle = post?.text
    ? post.text.replace(/<[^>]+>/g, "").slice(0, 100)
    : "Check out this post on SocialX!";

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`, { state: { autoFocusComment: true } });
  };
  const handleCommentClick = () => {
    if (variant === "detailed") {
      setIsCommentOpen(false);
    } else {
      setIsCommentOpen((prev) => {
        const next = !prev;
        if (next) {
          setFocusTrigger((prev) => prev + 1);
        }
        return next;
      });
    }
  };
  const iNotFeed = variant === "detailed" || variant === "profile";
  return (
    <>
      <Card
        className={`bg-card mx-auto w-full max-w-2xl gap-0 overflow-visible py-3 ${
          iNotFeed
            ? "border-border bg-background rounded-none border-x-0 border-t-0 border-b shadow-none"
            : "rounded-xl border border-gray-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        }`}
      >
        <CardHeader className="flex flex-row items-start justify-between gap-3 px-4 pb-2 sm:px-6">
          <div className="flex flex-row items-start gap-2.5">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage
                src={post?.author.avatarUrl?.url}
                alt={post?.author.fullName}
              />
              <AvatarFallback>{post?.author.fullName[0]}</AvatarFallback>
            </Avatar>

            <Link
              to={`/profile/${post?.author._id}`}
              className="flex min-w-0 flex-col"
            >
              <h4 className="truncate text-sm leading-tight font-semibold text-gray-100">
                {post?.author.fullName}
              </h4>

              <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                <span className="truncate">@{post?.author.userName}</span>
                <span>·</span>
                <span className="shrink-0">
                  {getRelativeTime(post.createdAt)}
                </span>
              </div>
            </Link>
          </div>

          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => deletePost(post?._id)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="text-shadow-destructive text-destructive h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>

        <CardContent
          className="cursor-pointer p-1.5 pt-0 sm:p-3 sm:pt-1.5"
          onClick={(e) => {
            if ((e.target as HTMLElement).tagName === "IMG") return;
            handlePostClick(post?._id);
          }}
        >
          <div
            className="prose dark:prose-invert ml-4 max-w-none px-0 text-[15px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: safeHTML }}
          ></div>
          {post.topics && post.topics.length > 0 && (
            <div className="mt-2 ml-4 flex flex-wrap gap-x-2">
              {post.topics.map((topic, index) => (
                <span
                  key={index}
                  className="cursor-pointer text-sm text-blue-400 transition-colors hover:text-blue-300 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      `/topic/${encodeURIComponent(topic.toLowerCase())}`,
                    );
                  }}
                >
                  #{topic}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 px-2">
            {hasSingleImage && (
              <img
                src={
                  typeof post?.images?.[0] === "string"
                    ? post?.images[0]
                    : post?.images?.[0]?.url
                }
                alt="Post attachment"
                onClick={() => {
                  setSelectedImageIndex(0);
                  setIsPreviewing(true);
                }}
                loading="lazy"
                className="border-border/50 bg-muted aspect-4/3 w-full rounded-xl border object-cover sm:aspect-video"
              />
            )}

            {hasMultipleImages && (
              <Carousel className="group relative w-full">
                <CarouselContent>
                  {post?.images?.map((image, index) => {
                    const imgSrc =
                      typeof image === "string" ? image : image?.url;

                    return (
                      <CarouselItem key={index}>
                        <img
                          src={imgSrc}
                          alt={`Post image ${index + 1}`}
                          loading="lazy"
                          onClick={() => {
                            setSelectedImageIndex(index);
                            setIsPreviewing(true);
                          }}
                          className="border-border/50 bg-muted aspect-4/3 w-full rounded-xl border object-cover sm:aspect-video"
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>

                <div className="hidden opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                  <CarouselPrevious className="bg-background/80 left-2 backdrop-blur-sm" />
                  <CarouselNext className="bg-background/80 right-2 backdrop-blur-sm" />
                </div>
              </Carousel>
            )}
          </div>
        </CardContent>
        <div className="flex items-center justify-between px-5 pt-2 pb-1">
          <div className="flex items-center gap-4">
            <HeartIcon post={post} currentUserId={user?._id as string} />

            <button
              className="group flex cursor-pointer items-center gap-2 transition-colors hover:text-blue-500"
              onClick={handleCommentClick}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:bg-blue-500/10">
                <CommentIcon size={20} />
              </div>
              <span className="text-sm">{comments?.length || 0}</span>
            </button>

            <div>
              <SharePosts postId={post?._id} postTitle={postTitle} />
            </div>
          </div>

          <BookmarkIcon postId={post?._id} size={20} />
        </div>
        <div className="mt-1.5 px-2">
          {isCommentOpen && (
            <CommentInput postId={post?._id} focusTrigger={focusTrigger} />
          )}
        </div>
      </Card>
      <AnimatePresence>
        {isPreviewing && (post.images?.length ?? 0) > 0 && (
          <ImagePreview
            images={previewImages}
            isFullScreen={true}
            initialIndex={selectedImageIndex}
            onClose={() => setIsPreviewing(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
export default PostCard;
