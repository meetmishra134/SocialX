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
        <div className="border-border bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
          <TabsList className="bg-muted/50 grid w-full grid-cols-2 rounded-xl p-1">
            <TabsTrigger
              value="foryou"
              className="cursor-pointer rounded-lg text-sm font-medium transition-colors"
              onClick={() => navigate("/feed/foryou")}
            >
              For You
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="cursor-pointer rounded-lg text-sm font-medium transition-colors"
              onClick={() => navigate("/feed/following")}
            >
              Following
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
};

export default FeedTab;
