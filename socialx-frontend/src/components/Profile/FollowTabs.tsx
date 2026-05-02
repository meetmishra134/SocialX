import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useProfileData } from "@/hooks/useProfileData";

const FollowTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname.includes("following")
    ? "following"
    : "followers";
  const { userId } = useParams();
  const { data: profile } = useProfileData(userId as string);
  useDocumentTitle(`${profile?.userName} - ${activeTab}`);
  return (
    <div className="flex h-screen flex-col">
      <Tabs value={activeTab} className="flex h-full flex-col">
        <TabsList className="bg-background sticky top-0 z-10 grid w-full grid-cols-2">
          <TabsTrigger
            value="followers"
            className="cursor-pointer"
            onClick={() => navigate(`/profile/${userId}/followers`)}
          >
            Followers
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="cursor-pointer"
            onClick={() => navigate(`/profile/${userId}/following`)}
          >
            Following
          </TabsTrigger>
        </TabsList>
        <div className="no-scrollbar flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
};

export default FollowTabs;
