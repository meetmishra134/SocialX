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
import TopicChip from "./TopicChip";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const user = useAuth((state) => state.user);
  const { mutate: deletePost } = useDeletePost();
  const hasMultipleImages = (post?.images?.length ?? 0) > 1;
  const { data } = useComment(post._id);
  const comments = data?.pages.flatMap((page) => page.comments) || [];
  const hasSingleImage = post?.images && (post.images?.length ?? 0) === 1;
  const navigate = useNavigate();
  const isAuthor = user?._id === post.author._id;
  const rawText = post.text || "";
  const trimmedText = rawText.replace(/(<p><br><\/p>)+$/g, "");
  const safeHTML = DOMPurify.sanitize(trimmedText);

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };
  return (
    <Card className="border-border bg-card mx-auto w-full max-w-2xl gap-0 overflow-hidden rounded-2xl border py-3 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-4 pb-2 sm:px-6">
        <div className="flex flex-row items-start gap-2.5">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage
              src={post.author.avatarUrl}
              alt={post.author.fullName}
            />
            <AvatarFallback>{post.author.fullName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <Link
              to={`/profile/${post.author.userName}`}
              className="flex min-w-0 flex-col sm:flex-row sm:items-center sm:gap-1.5"
            >
              <h4 className="hover:decoration-muted-foreground cursor-pointer truncate text-sm font-semibold hover:underline">
                {post.author.fullName}
              </h4>
              <div className="text-muted-foreground flex min-w-0 items-center gap-1 text-xs sm:text-sm">
                <span className="truncate text-xs">
                  @{post.author.userName}
                </span>
                <span className="shrink-0">·</span>
                <span className="shrink-0 text-xs">
                  {getRelativeTime(post.createdAt)}
                </span>
              </div>
            </Link>
            {post.topics && post.topics.length > 0 && (
              <div className="mt-2.5 -ml-[47px] flex flex-wrap gap-1.5 sm:mt-1 sm:ml-0">
                {post.topics.map((topic, index) => (
                  <TopicChip key={index} topic={topic} />
                ))}
              </div>
            )}
          </div>
        </div>

        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="ml-auto">
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
                onClick={() => deletePost(post._id)}
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
        onClick={() => handlePostClick(post._id)}
      >
        <div
          className="prose dark:prose-invert ml-4 max-w-none px-0 text-sm"
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        ></div>

        <div className="mt-2 px-2">
          {hasSingleImage && (
            <img
              src={
                typeof post?.images?.[0] === "string"
                  ? post?.images[0]
                  : post?.images?.[0]?.url
              }
              alt="Post attachment"
              loading="lazy"
              className="border-border/50 bg-muted aspect-4/3 w-full rounded-xl border object-cover sm:aspect-video"
            />
          )}

          {hasMultipleImages && (
            <Carousel className="group relative w-full">
              <CarouselContent>
                {post.images?.map((image, index) => {
                  const imgSrc = typeof image === "string" ? image : image?.url;

                  return (
                    <CarouselItem key={index}>
                      <img
                        src={imgSrc}
                        alt={`Post image ${index + 1}`}
                        loading="lazy"
                        className="border-border/50 bg-muted aspect-4/3 w-full rounded-xl border object-cover sm:aspect-video"
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              {/* Navigation Arrows */}
              <div className="hidden opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                <CarouselPrevious className="bg-background/80 left-2 backdrop-blur-sm" />
                <CarouselNext className="bg-background/80 right-2 backdrop-blur-sm" />
              </div>
            </Carousel>
          )}
        </div>
      </CardContent>
      <div className="flex items-center justify-between px-6 pt-2 pb-1">
        <div className="flex items-center gap-4">
          {/* <button className="group flex items-center gap-2 transition-colors hover:text-red-500">
            <div className="flex h-4 w-4 items-center justify-center rounded-full transition-colors group-hover:bg-red-500/10 md:h-8 md:w-8">
              <HeartIcon size={20} isFilled={false} />
            </div>
            <span className="text-sm">2</span>
          </button> */}
          <HeartIcon postId={post._id} />

          <button className="group flex items-center gap-2 transition-colors hover:text-blue-500">
            <div className="flex h-4 w-4 items-center justify-center rounded-full transition-colors group-hover:bg-blue-500/10 md:h-8 md:w-8">
              <CommentIcon size={20} isFilled={false} />
            </div>
            <span className="text-sm">{comments?.length || 0}</span>
          </button>
        </div>
        <BookmarkIcon postId={post._id} size={20} />
      </div>
    </Card>
  );
};
export default PostCard;
