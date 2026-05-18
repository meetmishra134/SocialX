import { ArrowDownIcon, Loader, Trash } from "lucide-react";
import { TabsContent } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import {
  useDeleteCommunityMember,
  useGetAllMembers,
} from "@/hooks/useCommunity";
import type { Community, Members } from "@/types/community.types";

interface MembersTabProps {
  communityId: string;
  community: Community;
  isCreator: boolean;
}

const MembersTab = ({ communityId, community, isCreator }: MembersTabProps) => {
  const {
    data: member,
    isError: isMembersError,
    isLoading: isMembersLoading,
    isFetchingNextPage: isMembersFetchingNextPage,
    hasNextPage: hasMembersNextPage,
    fetchNextPage: fetchMembersNextPage,
  } = useGetAllMembers(communityId as string);
  const members =
    member?.pages
      .flatMap((page) => (Array.isArray(page) ? page : (page?.members ?? [])))
      .filter(
        (member): member is Members => !!member?._id && !!member?.userName,
      ) ?? [];
  const navigate = useNavigate();
  const { mutate: deleteCommunityMember, isPending: isDeleting } =
    useDeleteCommunityMember(communityId as string);
  const creatorId =
    typeof community.creator === "object"
      ? community.creator?._id
      : community.creator;
  return (
    <TabsContent value="members" className="mt-0 p-4 outline-none">
      {isMembersLoading ? (
        <div className="flex items-center justify-center gap-3 py-12">
          <Loader className="text-muted-foreground mx-auto animate-spin" />
        </div>
      ) : isMembersError ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          Failed to load members
        </p>
      ) : (
        <div className="flex flex-col p-2">
          <div className="flex flex-col gap-3">
            {members?.map((member) => {
              const isCreatorMember =
                member._id === community.creator?.toString();
              return (
                <div
                  key={member._id}
                  className="hover:bg-muted/40 flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatarUrl?.url} />
                    <AvatarFallback className="text-sm font-medium">
                      {member.fullName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className="min-w-0 flex-1"
                    onClick={() => navigate(`/profile/${member._id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {member.fullName}
                      </p>
                      {isCreatorMember && (
                        <span className="bg-muted text-muted-foreground shrink-0 rounded-full px-2 py-0.5 text-[10px]">
                          Creator
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground truncate text-xs">
                      @{member.userName}
                    </p>
                  </div>
                  {isCreator && member._id !== creatorId ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      disabled={isDeleting}
                      onClick={() =>
                        deleteCommunityMember({
                          communityId: community._id,
                          userId: member._id,
                        })
                      }
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="flex w-full justify-center py-6">
            {hasMembersNextPage && (
              <button
                onClick={() => fetchMembersNextPage()}
                disabled={isMembersFetchingNextPage}
                className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold transition disabled:opacity-50"
              >
                {isMembersFetchingNextPage ? (
                  <Loader className="animate-spin" />
                ) : (
                  <ArrowDownIcon className="animate-bounce" />
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default MembersTab;
