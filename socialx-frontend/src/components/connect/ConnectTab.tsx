import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const ConnectTab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.includes("requests")
    ? "requests"
    : "connect";
  return (
    <div className="flex h-screen flex-col">
      <Tabs className="flex h-full flex-col" defaultValue={currentTab}>
        <TabsList className="bg-background sticky top-0 z-10 grid w-full grid-cols-2">
          <TabsTrigger
            value="connect"
            className="cursor-pointer"
            onClick={() => navigate("/connect")}
          >
            Connect
          </TabsTrigger>
          <TabsTrigger
            value="Requests"
            className="cursor-pointer"
            onClick={() => navigate("/connect/requests")}
          >
            Requests
          </TabsTrigger>
        </TabsList>
        <div className="no-scrollbar flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
};

export default ConnectTab;
