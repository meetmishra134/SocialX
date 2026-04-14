import { toast } from "sonner";
import { Label } from "../ui/label";
import { ImageIcon, Loader2, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import RichTextEditor from "./RichTextEditor";
import { useForm, Controller } from "react-hook-form";
import { useCreatePost } from "@/hooks/useCreatePost";
import { useState } from "react";

export interface PostFormData {
  text: string;
  images: File[];
}
interface CreatePostFormProps {
  onSuccessClose: () => void;
}
const CreatePostForm = ({ onSuccessClose }: CreatePostFormProps) => {
  const { mutate: createPost, isPending } = useCreatePost();
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<PostFormData>({
      defaultValues: {
        text: "",
        images: [],
      },
    });

  const images = watch("images");
  const text = watch("text");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 4) {
      toast.error("You can only upload up to 4 images", {
        position: "top-center",
      });
      return;
    }
    setValue("images", [...images, ...files], { shouldValidate: true });
    e.target.value = "";
  };

  const handledeleteImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTopic = topicInput.trim().toLowerCase();
      if (newTopic && !topics.includes(newTopic) && topics.length < 5) {
        setTopics([...topics, newTopic]);
        setTopicInput("");
      }
    }
  };
  const handleTopicDelete = (id: number) => {
    const updatedTopics = topics.filter((_, index) => index !== id);
    setTopics(updatedTopics);
  };

  const onSubmit = (data: PostFormData) => {
    console.log("Text:", data.text);
    console.log("Attached Files:", data.images);
    console.log("Topics:", topics);

    const formData = new FormData();

    if (data.text && data.text !== "<p><br></p>") {
      formData.append("text", data.text);
    }

    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append("files", file);
      });
    }
    topics.forEach((topic) => formData.append("topics", topic));
    console.log(data);
    // Example API Call:
    createPost(formData, {
      onSuccess: () => {
        reset();
        setValue("text", "");
        setValue("images", []);
        if (onSuccessClose) {
          onSuccessClose();
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Controller
        name="text"
        control={control}
        render={({ field }) => (
          <RichTextEditor
            value={field.value}
            onChange={field.onChange}
            placeholder="What's on your mind?"
          />
        )}
      />
      <div className="flex flex-col gap-2 rounded-xl border p-3">
        <Label htmlFor="topics">Topics</Label>
        {topics.length < 5 && (
          <Input
            type="text"
            value={topicInput}
            onKeyDown={handleKeyDown}
            onChange={(e) => setTopicInput(e.target.value)}
            id="topics "
            placeholder={
              topics.length === 0 ? "e.g. javascript, career..." : "Add more..."
            }
            className="min-w-[120px] flex-1 bg-transparent text-sm outline-none"
          />
        )}
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, index) => (
            <span
              key={index}
              className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-3 py-1 text-sm"
            >
              #{topic}
              <button
                className="hover:text-red-500"
                onClick={() => handleTopicDelete(index)}
              >
                <XIcon className="size-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`preview-${index}`}
                className="max-h-40 w-full rounded-md border object-cover"
              />
              <button
                type="button"
                onClick={() => handledeleteImage(index)}
                className="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-sm text-white shadow-md hover:bg-red-600"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <Label
          className={`hover:bg-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors ${
            images.length >= 4
              ? "cursor-not-allowed opacity-50"
              : "text-primary"
          }`}
        >
          <ImageIcon className="h-5 w-5" />
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            disabled={images.length >= 4}
          />
        </Label>

        <Button
          type="submit"
          disabled={
            (images.length === 0 && (!text || text === "<p><br></p>")) ||
            isPending
          }
          className="w-25 cursor-pointer rounded-full font-bold"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              "Posting..."
            </>
          ) : (
            "Post"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
