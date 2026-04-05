import { useState } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { ImageIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import RichTextEditor from "./RichTextEditor"; // 1. Import your Quill component

const CreatePostForm = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 4) {
      toast.error("You can only upload up to 4 images", {
        position: "top-center",
      });
      return;
    }
    setImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handledeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    console.log("Text HTML:", content);
    console.log("Attached Files:", images);
  };

  return (
    <div className="flex flex-col gap-4">
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="What's on your mind?"
      />

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
          className={`hover:bg-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors ${images.length >= 4 ? "cursor-not-allowed opacity-50" : "text-primary"}`}
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
          onClick={handlePost}
          disabled={!content && images.length === 0}
          className="w-25 cursor-pointer rounded-full font-bold"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default CreatePostForm;
