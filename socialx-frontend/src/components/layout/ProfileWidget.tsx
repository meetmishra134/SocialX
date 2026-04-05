import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ProfileWidget = () => {
  return (
    <Card className="border-accent mx-auto w-full max-w-xl gap-4 p-2 shadow-lg">
      <div className="flex flex-col items-center">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSefW2T8BGhHrcrEOgGMOMpKgBKMahj9ClYDQ&s"
          alt="Profile"
          className="size-12 rounded-full"
        />
        <CardHeader className="mt-2 flex w-full flex-col items-center gap-1 text-center">
          <CardTitle className="flex flex-col items-center gap-0.5 text-sm">
            <span className="text-primary">John Doe</span>
            <span className="text-muted-foreground">@johndoe</span>
          </CardTitle>
        </CardHeader>
      </div>
      <CardContent className="divide-accent text-foreground flex items-center justify-between divide-x-2 px-0 text-sm">
        <div className="flex w-full flex-col px-4 text-center">
          <span>Followers</span>
          <span>2 </span>
        </div>
        <div className="flex w-full flex-col px-4 text-center">
          <span>Following</span>
          <span>5 </span>
        </div>
        <div className="flex w-full flex-col px-4 text-center">
          <span>Posts</span>
          <span>10 </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileWidget;
