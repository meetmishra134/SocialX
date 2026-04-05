import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PostCard from "../posts/PostCard";
import type { Post } from "@/types/post.types";

const posts: Post[] = [
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
interface ProfileLayoutProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileLayout = ({ open, setOpen }: ProfileLayoutProps) => {
  return (
    <>
      <div className="bg-muted/70 relative h-50 w-full">
        <Avatar className="border-muted/40 ring-ring absolute -bottom-12 left-4 z-10 h-32 w-32 border-2 ring-2">
          <AvatarImage
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
            alt="Profile Picture"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
      <div className="relative border-b border-neutral-700 px-6 pt-14 pb-2">
        <div>
          <h2 className="text-xl font-bold">John Doe</h2>
          <p className="text-muted-foreground">@johndoe</p>
          <p className="mt-2 text-[1rem] leading-relaxed">
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
          <div key={post.id} className="border-border border-b">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileLayout;
