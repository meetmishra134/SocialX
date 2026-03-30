import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <>
      <div className="bg-muted/70 relative h-50 w-full">
        <Avatar className="border-muted/40 absolute -bottom-12 left-4 z-10 h-32 w-32 border-2">
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
            variant="outline"
            className="mt-4 ml-auto cursor-pointer rounded-full"
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
    </>
  );
};

export default ProfileLayout;
