import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useRef } from "react";
import { useAuth } from "@/store/authStore";

const EditProfileForm = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { fullName, userName, avatarUrl } =
    useAuth((state) => state.user) || {};
  const openFile = () => {
    fileRef.current?.click();
  };
  return (
    <div className="mt-2 flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl?.url} alt="Profile" />
            <AvatarFallback>
              {fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <button
            className="absolute right-0 bottom-0 cursor-pointer bg-black/60 p-1"
            onClick={openFile}
          >
            <Camera size={14} />
          </button>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileRef}
          />
        </div>
        <p className="text-muted-foreground text-sm">Change Profile Picture</p>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">UserName</Label>
        <Input placeholder="eg John doe" defaultValue={userName} />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Bio</Label>
        <Textarea
          placeholder="Write something about yourself"
          className="resize-none"
        />
      </div>
      <div className="flex justify-center pt-2 md:justify-end">
        <Button className="cursor-pointer rounded-full">Save Changes</Button>
      </div>
    </div>
  );
};

export default EditProfileForm;
