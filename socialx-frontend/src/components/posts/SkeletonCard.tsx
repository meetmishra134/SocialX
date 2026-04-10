import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const SkeletonCard = () => {
  return (
    <Card className="border-border bg-card mx-auto w-full max-w-2xl gap-0 overflow-hidden rounded-2xl border py-3 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-3 px-4 pb-2 sm:px-6">
        <div className="5 flex flex-row gap-2">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-col">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="mt-1 h-3 w-16 rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="border-border/50 bg-muted aspect-4/3 w-full rounded-xl border object-cover sm:aspect-video" />
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;
