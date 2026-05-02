import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const FeedTab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.includes("following")
    ? "following"
    : "foryou";
  useDocumentTitle("Home");
  return (
    <div className="flex h-screen flex-col">
      <Tabs value={currentTab} className="flex h-full flex-col">
        <TabsList className="bg-background sticky top-0 z-10 grid w-full grid-cols-2">
          <TabsTrigger
            value="foryou"
            className="relative cursor-pointer text-sm font-medium text-gray-400 transition-colors data-[state=active]:text-white"
            onClick={() => navigate("/feed/foryou")}
          >
            For You
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="relative cursor-pointer text-sm font-medium text-gray-400 transition-colors data-[state=active]:text-white"
            onClick={() => navigate("/feed/following")}
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

export default FeedTab;
