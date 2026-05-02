import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SkeletonCard from "../posts/SkeletonCard";

const ProfileSkeleton = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="bg-background/80 sticky top-0 z-50 flex items-center gap-3 border-b px-3 py-2 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-muted rounded-full p-2 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col gap-1.5 leading-tight">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>

      <div className="relative h-44 w-full bg-linear-to-b from-neutral-700 to-neutral-800">
        <Skeleton className="absolute -bottom-12 left-4 h-24 w-24 rounded-full border-4" />
      </div>

      {/* Profile info */}
      <div className="relative border-b border-neutral-700 px-4 pt-14 pb-2">
        <div>
          {/* Full name */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-36" />
          </div>

          {/* Username */}
          <Skeleton className="mt-2 h-3 w-24" />

          {/* Bio */}
          <Skeleton className="mt-1.5 h-3 w-28" />
        </div>

        {/* Edit / Follow button */}
        <div className="absolute top-4 right-4">
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>

        {/* Followers / Following */}
        <div className="mt-2.5 flex gap-5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Posts */}
      <div className="flex flex-col space-y-4 px-3 py-4">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
