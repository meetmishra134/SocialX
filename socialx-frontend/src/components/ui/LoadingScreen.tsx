import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="bg-background fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin opacity-60" />
      </div>
    </div>
  );
};
