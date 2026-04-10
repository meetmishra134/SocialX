import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PostCard from "../posts/PostCard";
import type { Post } from "@/types/post.types";
import { useAuth } from "@/store/authStore";

const posts: Post[] = [
  {
    _id: "post1",
    author: {
      id: "69cf68ae4d16faf04cd3b5c2",
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
    _id: "post2",
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
    _id: "post3",
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
interface ProfileLayoutProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileLayout = ({ open, setOpen }: ProfileLayoutProps) => {
  const { fullName, userName, avatarUrl } =
    useAuth((state) => state.user) || {};
  return (
    <>
      <div className="bg-muted/70 relative h-50 w-full">
        <Avatar className="border-muted/40 ring-ring absolute -bottom-12 left-4 z-10 h-28 w-28 border-2 ring-2">
          <AvatarImage
            src={avatarUrl?.url}
            alt="Profile Picture"
            referrerPolicy="no-referrer"
          />
          <AvatarFallback>
            {fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="relative border-b border-neutral-700 px-6 pt-14 pb-2">
        <div>
          <h2 className="text-lg font-bold">{fullName}</h2>
          <p className="text-muted-foreground text-sm">@{userName}</p>
          <p className="mt-2 text-[0.9rem] leading-relaxed">
            UI/UX | Builder passionate about creating intuitive user experiences
            and solving complex design problems.
          </p>
        </div>
        <div className="absolute top-0 right-2">
          <Button
            className="mt-4 ml-auto cursor-pointer rounded-full"
            onClick={() => setOpen(!open)}
          >
            Edit Profile
          </Button>
        </div>
        <div className="mt-2 flex gap-4 text-[0.95rem]">
          <div>
            <Link
              to="/profile/followers"
              className="text-foreground/90 hover:text-foreground hover:decoration-accent-foreground hover:underline"
            >
              <span>2</span>
              <span className="text-muted-foreground ml-1">Followers</span>
            </Link>
          </div>
          <div>
            <Link
              to="/profile/following"
              className="text-foreground/90 hover:text-foreground hover:decoration-accent-foreground hover:underline"
            >
              <span>5</span>
              <span className="text-muted-foreground ml-1">Following</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {posts.map((post) => (
          <div className="border-border border-b" key={post._id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileLayout;
