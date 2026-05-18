import { ArrowDownIcon, Loader, X } from "lucide-react";
import { TabsContent } from "../ui/tabs";
import CreatePostForm from "../posts/CreatePostForm";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetCommunityPosts } from "@/hooks/useCommunity";
import type { Post } from "@/types/post.types";
import { useAuth } from "@/store/authStore";
import FeedSkeleton from "../ui/FeedSkeleton";
import PostCard from "../posts/PostCard";
import type { Community } from "@/types/community.types";

interface PostTabProps {
  communityId: string;
  isJoined: boolean;
  isComposerOpen: boolean;
  setIsComposerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCreator: boolean;
  community: Community;
}

const PostTab = ({
  communityId,
  isJoined,
  isComposerOpen,
  setIsComposerOpen,
  isCreator,
  community
}: PostTabProps) => {
  const user = useAuth((state) => state.user);
  const {
    data,
    isError: isPostError,
    isLoading: isPostLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetCommunityPosts(communityId as string);
  const posts =
    data?.pages
      .flatMap((page) => (Array.isArray(page) ? page : (page?.posts ?? [])))
      .filter((post): post is Post => !!post?._id) ?? [];
  return (
    <TabsContent value="posts" className="mt-0 outline-none">
      {isJoined && (
        <div className="border-border border-b">
          {isComposerOpen ? (
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium">Create post</span>
                <button
                  onClick={() => setIsComposerOpen(false)}
                  className="hover:bg-muted flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors"
                >
                  <X className="text-muted-foreground h-4 w-4" />
                </button>
              </div>
              <CreatePostForm
                communityId={communityId}
                onSuccessClose={() => setIsComposerOpen(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsComposerOpen(true)}
              className="hover:bg-muted/40 flex w-full cursor-pointer items-center gap-3 p-4 transition-colors"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user?.avatarUrl?.url} />
                <AvatarFallback>{user?.userName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground max-w-2xl text-left text-sm">
                Share something with {community.name}...
              </span>
            </button>
          )}
        </div>
      )}

      {/* posts list */}
      {isPostLoading ? (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-y-4 px-3 py-2">
          {[1, 2, 3].map((i) => (
            <FeedSkeleton key={i} />
          ))}
        </div>
      ) : isPostError ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          Something went wrong while loading posts.
        </p>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          No posts yet. Be the first to post!
        </p>
      ) : (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-y-4 px-3 py-4">
          {posts?.map((post: Post) => (
            <PostCard key={post._id} post={post} communityCreator={isCreator} />
          ))}

          <div className="flex w-full justify-center py-6">
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold transition disabled:opacity-50"
              >
                {isFetchingNextPage ? (
                  <Loader className="animate-spin" />
                ) : (
                  <ArrowDownIcon className="animate-bounce" />
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default PostTab;
