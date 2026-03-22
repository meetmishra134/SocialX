import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import FollowingFeed from "./FollowingFeed";
import GlobalFeed from "./GlobalFeed";

const Feed = () => {
  return (
    <Tabs defaultValue="foryou">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="foryou" className="cursor-pointer">
          For You
        </TabsTrigger>
        <TabsTrigger value="following" className="cursor-pointer">
          Following
        </TabsTrigger>
      </TabsList>
      <TabsContent value="foryou">
        <GlobalFeed />
      </TabsContent>
      <TabsContent value="following">
        <FollowingFeed />
      </TabsContent>
    </Tabs>
  );
};

export default Feed;
