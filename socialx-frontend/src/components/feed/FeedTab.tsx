import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import FollowingFeed from "./FollowingFeed";
import GlobalFeed from "./GlobalFeed";

const FeedTab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.includes("following")
    ? "following"
    : "foryou";
  return (
    <div className="flex h-screen flex-col">
      <Tabs defaultValue={currentTab} className="flex h-full flex-col">
        <TabsList className="bg-background sticky top-0 z-10 grid w-full grid-cols-2">
          <TabsTrigger
            value="foryou"
            className="cursor-pointer"
            onClick={() => navigate("/home/foryou")}
          >
            For You
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="cursor-pointer"
            onClick={() => navigate("/home/following")}
          >
            Following
          </TabsTrigger>
        </TabsList>
        <div className="no-scrollbar flex-1 overflow-y-auto">
          <TabsContent value="foryou">
            <GlobalFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FeedTab;
