import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import EditProfileForm from "./EditProfileForm";

interface EditProfileProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile = ({ open, setOpen }: EditProfileProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <EditProfileForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
