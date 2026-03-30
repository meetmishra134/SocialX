import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { ImageIcon } from "lucide-react";
import { Input } from "../ui/input";

const CreatePostForm = () => {
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };
  const handledeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Textarea
          placeholder="what's on your mind?"
          className="min-h-45 w-full resize-none border-none capitalize outline-none focus-visible:ring-0"
        />
        <Label className="absolute right-1 bottom-2">
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
      </div>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt={`preview-${index}`}
              className="max-h-40 rounded-md"
            />
            <button
              onClick={() => handledeleteImage(index)}
              className="absolute -top-1 -right-1 cursor-pointer rounded-full text-white"
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePostForm;
