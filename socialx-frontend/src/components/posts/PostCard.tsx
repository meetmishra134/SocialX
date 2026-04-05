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

interface PostCardProps {
  post: Post;
  isFilled?: boolean;
  size?: number;
}

const PostCard = ({ post }: PostCardProps) => {
  const hasMultipleImages = post.images && post.images.length > 1;
  const hasSingleImage = post.images && post.images.length === 1;

  return (
    <Card className="border-border bg-card mx-auto w-full max-w-2xl gap-0 overflow-hidden rounded-2xl border py-3 shadow-sm transition-all hover:shadow-md">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-center gap-3 px-4 pb-2 sm:px-6">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={post.author.avatarUrl} alt={post.author.fullName} />
          <AvatarFallback>{post.author.fullName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <h3 className="truncate text-sm font-semibold sm:text-base">
            {post.author.fullName}
          </h3>
          <p className="text-muted-foreground truncate text-xs sm:text-sm">
            @{post.author.userName} ·{" "}
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="p-2 pt-0 sm:p-3 sm:pt-2">
        <p className="text-foreground/90 ml-4 text-sm leading-relaxed whitespace-pre-wrap">
          {post.text}
        </p>

        {/* IMAGE HANDLING */}
        <div className="mt-2 px-2">
          {/* Fallback for a single image */}
          {hasSingleImage && (
            <img
              src={post.images?.[0]}
              alt="Post attachment"
              loading="lazy"
              className="border-border/50 bg-muted aspect-4/3 w-full rounded-xl border object-cover sm:aspect-video"
            />
          )}

          {/* Carousel for multiple images */}
          {hasMultipleImages && (
            <Carousel className="group relative w-full">
              <CarouselContent>
                {post.images?.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={image}
                      alt={`Post image ${index + 1}`}
                      loading="lazy"
                      // Fixed aspect ratio so the carousel doesn't jump in height
                      className="border-border/50 bg-muted aspect-4/3 w-full rounded-xl border object-cover sm:aspect-video"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Arrows: Hidden on mobile (users will swipe), visible on desktop */}
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
          <button className="group flex items-center gap-2 transition-colors hover:text-red-500">
            <div className="flex h-4 w-4 items-center justify-center rounded-full transition-colors group-hover:bg-red-500/10 md:h-8 md:w-8">
              <HeartIcon size={20} isFilled={false} />
            </div>
            <span className="text-sm">2</span>
          </button>

          <button className="group flex items-center gap-2 transition-colors hover:text-blue-500">
            <div className="flex h-4 w-4 items-center justify-center rounded-full transition-colors group-hover:bg-blue-500/10 md:h-8 md:w-8">
              <CommentIcon size={20} isFilled={false} />
            </div>
            <span className="text-sm">1</span>
          </button>
        </div>

        <button className="hover:text-primary group flex items-center transition-colors">
          <div className="group-hover:bg-primary/10 flex h-4 w-4 items-center justify-center rounded-full transition-colors md:h-8 md:w-8">
            <BookmarkIcon size={20} isFilled={false} />
          </div>
        </button>
      </div>
    </Card>
  );
};
export default PostCard;
