import { ArrowDownIcon, Hash, Loader, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Connect from "./Connect";
import CommunityCard from "../communities/CommunityCard";
import { useDiscoverCommunities } from "@/hooks/useCommunity";
import { Skeleton } from "../ui/skeleton";

const ExploreTab = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useDiscoverCommunities();
  const activeTab =
    new URLSearchParams(window.location.search).get("tab") || "communities";
  const communities =
    data?.pages.flatMap((page) =>
      Array.isArray(page) ? page : (page?.communities ?? []),
    ) ?? [];

  return (
    <div className="border-border mx-auto min-h-screen w-full max-w-2xl border-x pb-20">
      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={(val) => navigate(`?tab=${val}`)}
      >
        <TabsList className="bg-muted/50 sticky top-0 z-10 mb-2 grid w-full grid-cols-2 rounded-xl p-1 backdrop-blur">
          <TabsTrigger
            value="communities"
            className="cursor-pointer rounded-lg"
          >
            <Hash className="mr-2 h-4 w-4" />
            Communities
          </TabsTrigger>
          <TabsTrigger value="people" className="cursor-pointer rounded-lg">
            <Users className="mr-2 h-4 w-4" />
            People
          </TabsTrigger>
        </TabsList>

        <TabsContent value="communities" className="mt-0 outline-none">
          {isLoading ? (
            <div className="flex flex-col gap-3 p-4">
              {[1, 2, 3].map((id) => (
                <Skeleton key={id} className="bg-muted h-40 rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex min-h-[70vh] items-center justify-center">
              <p className="text-muted-foreground text-center text-sm">
                Failed to load communities
              </p>
            </div>
          ) : communities.length === 0 ? (
            <div className="flex min-h-[70vh] items-center justify-center">
              <p className="text-muted-foreground text-center text-sm">
                No communities to discover yet
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 p-4">
                {communities.map((community) => (
                  <CommunityCard key={community._id} community={community} />
                ))}
              </div>

              {/* load more / end */}
              <div className="flex w-full justify-center py-6">
                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold transition disabled:opacity-50"
                  >
                    {isFetchingNextPage ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <ArrowDownIcon className="animate-bounce" />
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </TabsContent>

        {/* people tab */}
        <TabsContent value="people" className="mt-0 outline-none">
          <Connect />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExploreTab;
