import type { PaginatedUsers, UserCardType } from "@/types/user.types";
import UserCard from "./UserCard";
import { useDiscovery } from "@/hooks/useDiscovery";
import { ArrowDownIcon, Loader } from "lucide-react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import FollowButton from "./FollowButton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Connect = () => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useDiscovery();
  const queryClient = useQueryClient();
  useDocumentTitle("Connect");

  const users =
    data?.pages
      .flatMap((page) => (Array.isArray(page) ? page : (page?.users ?? [])))
      .filter((user): user is UserCardType => !!user?._id) ?? [];

  const handleFollowSuccess = (userId: string) => {
    setTimeout(() => {
      queryClient.setQueryData(
        ["discover-users"],
        (old: InfiniteData<PaginatedUsers>) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: PaginatedUsers) => ({
              ...page,
              users: page.users.filter((u: UserCardType) => u._id !== userId),
            })),
          };
        },
      );
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-3">
      {isError ? (
        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-muted-foreground">Failed to load users.</p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader className="animate-spin" size={25} />
        </div>
      ) : null}

      {!isLoading && users.length === 0 ? (
        <div className="text-muted-foreground flex min-h-[70vh] items-center justify-center text-center">
          No new users to discover right now.
        </div>
      ) : (
        <>
          {users.map((user: UserCardType) => (
            <UserCard
              user={user}
              key={user._id}
              action={
                <FollowButton
                  userId={user._id}
                  initialIsFollowing={user.isFollowing}
                  onSuccess={handleFollowSuccess}
                  followsMe={user.followsMe}
                  isLoading={isFetching}
                />
              }
            />
          ))}

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
    </div>
  );
};
export default Connect;
