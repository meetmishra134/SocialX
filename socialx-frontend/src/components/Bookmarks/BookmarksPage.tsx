import type { Post } from "@/types/post.types";
import PostCard from "../posts/PostCard";
import { Lock, BookmarkX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const posts: Post[] = [
  // {
  //   _id: "post1",
  //   author: {
  //     id: "69cf68ae4d16faf04cd3b5c2",
  //     fullName: "John Doe",
  //     userName: "JohnDoe123",
  //     avatarUrl: "https://example.com/avatar.jpg",
  //   },
  //   text: "This is a sample post.",
  //   createdAt: "2023-01-01T00:00:00Z",
  //   images: [
  //     "https://images.pexels.com/photos/34302384/pexels-photo-34302384.jpeg",
  //   ],
  //   likes: [],
  // },
  // {
  //   _id: "post2",
  //   author: {
  //     id: "user2",
  //     fullName: "Jane Smith",
  //     userName: "JaneSmith123",
  //     avatarUrl: "https://example.com/avatar2.jpg",
  //   },
  //   text: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  //   createdAt: "2023-01-01T00:00:00Z",
  //   images: [],
  //   likes: [],
  // },
  // {
  //   _id: "post3",
  //   author: {
  //     id: "user3",
  //     fullName: "Bob Johnson",
  //     userName: "BobJohnson123",
  //     avatarUrl: "https://example.com/avatar3.jpg",
  //   },
  //   images: [
  //     "https://images.pexels.com/photos/5596132/pexels-photo-5596132.jpeg",
  //     "https://images.pexels.com/photos/34302384/pexels-photo-34302384.jpeg",
  //   ],
  //   createdAt: "2023-01-01T00:00:00Z",
  //   likes: [],
  // },
];

const BookmarksPage = () => {
  return (
    <div className="border-border mx-auto min-h-screen w-full max-w-2xl border-x pb-20">
      <div className="bg-background/80 border-border sticky top-0 z-10 border-b p-4 backdrop-blur-md sm:px-6">
        <h1 className="text-xl font-bold tracking-tight">Bookmarks</h1>

        <div className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-xs">
          <Lock className="h-3.5 w-3.5" />
          <span>Only you can see what you've saved</span>
        </div>
      </div>

      <div className="flex flex-col">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
            <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full">
              <BookmarkX className="text-muted-foreground h-10 w-10 opacity-50" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Don't lose track of great posts. When you see something you want
              to remember, tap the bookmark icon to save it here.
            </p>
            <Button
              asChild
              variant="outline"
              className="rounded-full font-semibold"
            >
              <Link to="/feed/foryou">Explore the Feed</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-border divide-y">
            {posts.map((post) => (
              <div
                key={post._id}
                className="hover:bg-muted/30 transition-colors"
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
