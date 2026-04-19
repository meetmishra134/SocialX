import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/store/authStore";
import { useForm } from "react-hook-form";
import { useEditProfile } from "@/hooks/useEditProfile";
import { Spinner } from "../ui/spinner";

interface EditProfileFormData {
  avatar: File | null;
  userName: string;
  bio: string;
}
interface EditProfileFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditProfileForm = ({ setOpen }: EditProfileFormProps) => {
  const { mutate: editProfile, isPending } = useEditProfile();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const user = useAuth((state) => state.user);
  const [previewurl, setPreviewUrl] = useState<string | null>(
    user?.avatarUrl?.url || null,
  );
  const openFile = () => {
    fileRef.current?.click();
  };
  const { register, setValue, handleSubmit, reset } =
    useForm<EditProfileFormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
    setValue("avatar", file || null);
  };
  const onSubmit = (data: EditProfileFormData) => {
    const formData = new FormData();
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    formData.append("userName", data.userName);
    formData.append("bio", data.bio);
    editProfile(formData, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  useEffect(() => {
    reset({
      userName: user?.userName || "",
      bio: user?.bio || "",
      avatar: null,
    });
  }, [user, reset]);
  return (
    <form
      className="mt-2 flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={previewurl || undefined} alt="Profile" />
            <AvatarFallback>
              {user?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
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
            onChange={handleImageChange}
          />
        </div>
        <p className="text-muted-foreground text-sm">Change Profile Picture</p>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">UserName</Label>
        <Input placeholder="eg John doe" {...register("userName")} />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Bio</Label>
        <Textarea
          placeholder="Write something about yourself"
          className="resize-none"
          {...register("bio")}
        />
      </div>
      <div className="flex justify-center pt-2 md:justify-end">
        <Button
          type="submit"
          className="cursor-pointer rounded-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner data-icon="inline-start" />
              Saving
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
