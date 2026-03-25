import type { Post } from "@/types/post.types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import HeartIcon from "../icons/HeartIcon";
import CommentIcon from "../icons/CommentIcon";
import BookmarkIcon from "../icons/BookmarkIcon";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="mx-auto mb-6 w-full max-w-xl gap-2 overflow-hidden border-gray-600 py-2">
      <CardHeader className="flex flex-row items-center gap-3 pb-1">
        <Avatar>
          <AvatarImage src={post.author.avatarUrl} alt={post.author.userName} />
          <AvatarFallback>{post.author.userName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{post.author.userName}</span>
          <span className="text-muted-foreground text-sm">
            @{post.author.userName} .{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {post.text && (
          <div className="px-1 py-2">
            <p className="text-sm leading-relaxed">{post.text}</p>
          </div>
        )}
        {post.images?.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="Post image"
            className="max-h-[400px] rounded-lg object-cover"
          />
        ))}
        <div className="flex items-center justify-between gap-4 px-1 py-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <HeartIcon />
              <span className="text-sm">{post.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <CommentIcon />
              <span className="text-sm">0</span>
            </div>
          </div>
          <BookmarkIcon />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
