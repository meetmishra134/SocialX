import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface FriendSuggestion {
  name: string;
  username: string;
  AvatarUrl: string;
}

const friendsSuggestion: FriendSuggestion[] = [
  {
    name: "Jane Doe",
    username: "janedoe",
    AvatarUrl:
      "https://i.pinimg.com/736x/1f/37/d5/1f37d527b30603f3bddecdc2f828fa61.jpg",
  },
  {
    name: "Alice Smith",
    username: "alicesmith",
    AvatarUrl:
      "https://i.pinimg.com/736x/0a/ab/a9/0aaba9d6f3c9d778e65a23fad8dcdc2e.jpg",
  },
  {
    name: "Bob Johnson",
    username: "bobjohnson",
    AvatarUrl:
      "https://i.pinimg.com/736x/50/9a/ad/509aadab46c7a30b6dce14a0761ddeb6.jpg",
  },
];

const FriendSuggestionWidget = () => {
  return (
    <Card className="border-accent relative w-75 gap-4 p-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-primary relative w-full text-center text-[1.1rem] font-bold">
          Discover new friends
        </CardTitle>
      </CardHeader>
      <div className="bg-accent absolute top-10 right-0 left-0 h-0.5 w-full"></div>
      <CardContent className="px-2">
        <div className="flex flex-col gap-4">
          {friendsSuggestion.map((friend) => (
            <div
              key={friend.username}
              className="hover:bg-muted flex cursor-pointer items-center gap-4 p-1"
            >
              <img
                src={friend.AvatarUrl}
                alt={friend.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold hover:underline hover:underline-offset-1">
                  {friend.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  @{friend.username}
                </p>
              </div>
              <Button
                size="sm"
                variant="default"
                className="ml-auto cursor-pointer rounded-xl font-bold"
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center">
          <Link
            to="/connect"
            className="text-primary animate-pulse text-xs font-medium"
          >
            View all
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default FriendSuggestionWidget;
