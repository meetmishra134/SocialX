import { useLocation } from "react-router-dom";
import ProfileLayout from "./ProfileLayout";
import FollowTabs from "./FollowTabs";
import { useState } from "react";
import EditProfile from "./EditProfile";

const Profile = () => {
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation();
  const isFollowPage =
    location.pathname.includes("followers") ||
    location.pathname.includes("following");
  return (
    <div className="min-h-screen">
      {!isFollowPage && (
        <>
          <ProfileLayout open={open} setOpen={setOpen} />
          <EditProfile open={open} setOpen={setOpen} />
        </>
      )}
      {isFollowPage && <FollowTabs />}
    </div>
  );
};

export default Profile;
