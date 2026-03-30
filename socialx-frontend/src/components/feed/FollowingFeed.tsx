import type { Post } from "@/types/post.types";
import PostCard from "../posts/PostCard";
import { motion } from "motion/react";
const followingFeed: Post[] = [
  {
    id: "post1",
    author: {
      id: "user1",
      fullName: "John Doe",
      userName: "JohnDoe123",
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
      fullName: "Jane Smith",
      userName: "JaneSmith123",
      avatarUrl: "https://example.com/avatar2.jpg",
    },
    text: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    createdAt: "2023-01-01T00:00:00Z",
    images: [],
    likes: [],
  },
  {
    id: "post3",
    author: {
      id: "user3",
      fullName: "Bob Johnson",
      userName: "BobJohnson123",
      avatarUrl: "https://example.com/avatar3.jpg",
    },
    images: [
      "https://images.pexels.com/photos/5596132/pexels-photo-5596132.jpeg",
      "https://images.pexels.com/photos/34302384/pexels-photo-34302384.jpeg",
    ],
    createdAt: "2023-01-01T00:00:00Z",
    likes: [],
  },
];

const FollowingFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 p-4"
    >
      {followingFeed.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </motion.div>
  );
};

export default FollowingFeed;
