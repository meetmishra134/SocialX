import { ArrowDownIcon, Loader, Plus } from "lucide-react";
import JoinedCommunityRow from "./JoinedCommunityRow";
import { useState } from "react";
import CreateCommunity from "./CreateCommunity";
import { useGetJoinedCommunities } from "@/hooks/useCommunity";

const CommunitiesList = () => {
  const [createOpen, setCreateOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetJoinedCommunities();

  const joinedCommunities =
    data?.pages.flatMap((page) =>
      Array.isArray(page) ? page : (page?.communities ?? []),
    ) ?? [];

  return (
    <>
      {/* header */}
      <div className="border-border bg-background/80 sticky top-0 z-20 border-b p-4 backdrop-blur-md sm:px-6">
        <h1 className="text-foreground text-xl font-bold tracking-tight">
          Communities
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Your spaces, your people
        </p>
      </div>

      <div className="mx-auto max-w-2xl p-2.5 pb-20">
        <div
          onClick={() => setCreateOpen(true)}
          className="border-border hover:bg-muted/40 mb-4 flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed p-4 transition-all duration-200"
        >
          <div className="bg-muted flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
            <Plus className="text-muted-foreground h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Create a community</p>
            <p className="text-muted-foreground text-xs">
              Bring people together around a topic
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((id) => (
              <div
                key={id}
                className="bg-muted h-16 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : isError ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Failed to load communities
          </p>
        ) : joinedCommunities.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            You haven't joined any communities yet
          </p>
        ) : (
          <div className="mb-6">
            <h2 className="text-muted-foreground mb-3 px-2 text-sm font-medium">
              Your communities
            </h2>
            <div className="flex flex-col gap-4">
              {joinedCommunities.map((c) => (
                <JoinedCommunityRow key={c._id} community={c} />
              ))}
            </div>
          </div>
        )}

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
      </div>

      <CreateCommunity open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
};

export default CommunitiesList;
