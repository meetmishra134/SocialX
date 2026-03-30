import { Dialog, DialogContent } from "../ui/dialog";
import CreatePostForm from "./CreatePostForm";

interface CreatePostProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePost = ({ open, setOpen }: CreatePostProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-100 sm:max-w-md">
        <h2 className="text-lg font-semibold">Create a post</h2>
        <CreatePostForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
