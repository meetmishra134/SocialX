import { useState } from "react";
import { Settings, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DeleteModal from "../ui/DeleteModal";

interface CommunitySettingsProps {
  communityName: string;
  onDelete: () => void;
  isDeleting?: boolean;
}

const CommunitySettings = ({
  communityName,
  onDelete,
  isDeleting,
}: CommunitySettingsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="hover:bg-muted ml-auto flex h-8 w-8 items-center justify-center rounded-full transition-colors">
            <Settings className="text-muted-foreground h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-50 items-center justify-center"
        >
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Delete community
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteModal
        title={`Delete ${communityName}?`}
        description="This will permanently delete the community and all its posts. This action cannot be undone."
        onDelete={onDelete}
        isDeleting={isDeleting}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
      />
    </>
  );
};

export default CommunitySettings;
