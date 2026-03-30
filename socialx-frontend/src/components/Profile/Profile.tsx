import { useLocation } from "react-router-dom";
import ProfileLayout from "./ProfileLayout";
import FollowTabs from "./FollowTabs";

const Profile = () => {
  const location = useLocation();
  const isFollowPage =
    location.pathname.includes("followers") ||
    location.pathname.includes("following");
  return (
    <div className="min-h-screen">
      {!isFollowPage && <ProfileLayout />}
      {isFollowPage && <FollowTabs />}
    </div>
  );
};

export default Profile;
