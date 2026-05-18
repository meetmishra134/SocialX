import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";
import { useCreateCommunity } from "@/hooks/useCommunity";

interface CreateCommunityForm {
  name: string;
  description: string;
}

interface CreateCommunityProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateCommunity = ({ open, onOpenChange }: CreateCommunityProps) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { mutate: createCommunity, isPending } = useCreateCommunity();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateCommunityForm>({
    defaultValues: { name: "", description: "" },
  });

  const nameValue = watch("name");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = (data: CreateCommunityForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (avatarFile) formData.append("avatar", avatarFile);
    console.log("Form data to be sent:", {
      name: data.name,
      description: data.description,
      avatar: avatarFile,
    });
    createCommunity(formData, {
      onSuccess: () => {
        reset();
        setAvatarFile(null);
        setAvatarPreview(null);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a community</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 pt-2"
        >
          <div className="flex justify-center">
            <label className="group relative cursor-pointer">
              <Avatar className="h-20 w-20 rounded-2xl">
                <AvatarImage src={avatarPreview ?? undefined} />
                <AvatarFallback className="bg-muted rounded-2xl text-2xl font-medium">
                  {nameValue?.charAt(0).toUpperCase() || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <input
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "At least 3 characters" },
                maxLength: { value: 50, message: "Max 50 characters" },
              })}
              placeholder="e.g. CSE-3rdYear"
              className="border-input bg-muted/50 focus:border-border rounded-lg border px-3 py-2 text-sm transition-colors outline-none"
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                maxLength: { value: 200, message: "Max 200 characters" },
              })}
              placeholder="What is this community about?"
              rows={3}
              className="border-input bg-muted/50 focus:border-border resize-none rounded-lg border px-3 py-2 text-sm transition-colors outline-none"
            />
            <div className="flex items-center justify-between">
              {errors.description ? (
                <p className="text-destructive text-xs">
                  {errors.description.message}
                </p>
              ) : (
                <span />
              )}
              <span className="text-muted-foreground text-xs">
                {watch("description")?.length ?? 0}/200
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {isPending ? "Creating..." : "Create community"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunity;
