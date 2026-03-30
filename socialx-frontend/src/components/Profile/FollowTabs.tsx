import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import FollowersPage from "./FollowersPage";
import FollowingPage from "./FollowingPage";

const FollowTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.includes("following")
    ? "following"
    : "followers";

  return (
    <div className="flex h-screen flex-col">
      <Tabs defaultValue={activeTab} className="flex h-full flex-col">
        <TabsList className="bg-background sticky top-0 z-10 grid w-full grid-cols-2">
          <TabsTrigger
            value="followers"
            className="cursor-pointer"
            onClick={() => navigate("/profile/followers")}
          >
            Followers
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="cursor-pointer"
            onClick={() => navigate("/profile/following")}
          >
            Following
          </TabsTrigger>
        </TabsList>
        <div className="no-scrollbar flex-1 overflow-y-auto">
          <TabsContent value="followers">
            <FollowersPage />
          </TabsContent>
          <TabsContent value="following">
            <FollowingPage />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FollowTabs;
