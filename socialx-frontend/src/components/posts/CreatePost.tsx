import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import CreatePostForm from "./CreatePostForm";

interface CreatePostProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePost = ({ open, setOpen }: CreatePostProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <CreatePostForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
