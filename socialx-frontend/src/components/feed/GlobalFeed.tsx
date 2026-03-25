import type { Post } from "@/types/post.types";
import PostCard from "../posts/PostCard";

const posts: Post[] = [
  {
    id: "post1",
    author: {
      id: "user1",
      userName: "John Doe",
      avatarUrl: "https://example.com/avatar.jpg",
    },
    text: "This is a sample post.",
    createdAt: "2023-01-01T00:00:00Z",
    images: [
      "https://images.pexels.com/photos/34302384/pexels-photo-34302384.jpeg",
    ],
    likes: [],
  },
  {
    id: "post2",
    author: {
      id: "user2",
      userName: "Jane Smith",
      avatarUrl: "https://example.com/avatar2.jpg",
    },
    text: "This is another sample post.",
    createdAt: "2023-01-01T00:00:00Z",
    images: [],
    likes: [],
  },
  {
    id: "post3",
    author: {
      id: "user3",
      userName: "Bob Johnson",
      avatarUrl: "https://example.com/avatar3.jpg",
    },
    images: [
      "https://images.pexels.com/photos/5596132/pexels-photo-5596132.jpeg",
    ],
    createdAt: "2023-01-01T00:00:00Z",
    likes: [],
  },
];
const GlobalFeed = () => {
  return (
    <div className="p-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default GlobalFeed;
