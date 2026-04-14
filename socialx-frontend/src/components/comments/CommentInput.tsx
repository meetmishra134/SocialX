import { useAuth } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { SendHorizontal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useParams } from "react-router-dom";

const CommentInput = () => {
  const user = useAuth((state) => state.user);
  const { postId } = useParams() as { postId: string };
  const { mutate: createComment, isPending } = useCreateComment();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      text: "",
    },
  });
  const onSubmit = (data: { text: string }) => {
    createComment(
      { postId, comment: data.text },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
    console.log("Comment submitted:");
  };
  return (
    <div className="flex w-full items-start gap-2">
      <Avatar className="mt-1 h-7 w-7 sm:h-10 sm:w-10">
        <AvatarImage src={user?.avatarUrl?.url} alt={user?.userName} />
        <AvatarFallback>{user?.userName?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-muted/50 focus-within:border-border focus-within:bg-background relative flex items-end rounded-2xl border border-transparent p-1 shadow-sm transition-colors duration-200"
        >
          <Textarea
            placeholder={
              errors.text ? "Comment is required" : "Write a comment..."
            }
            className={`flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none disabled:opacity-50 sm:text-base ${errors.text ? "placeholder:text-destructive text-xs" : ""}`}
            {...register("text", { required: true })}
            disabled={isPending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          />

          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={isPending}
            className="text-primary hover:bg-primary/10 hover:text-primary absolute right-2 h-8 w-8 cursor-pointer rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <SendHorizontal className="size-4" />
          </Button>
        </form>

        <p className="text-muted-foreground ml-2 hidden text-[10px] sm:block">
          Press <kbd className="bg-muted rounded px-1 font-mono">Enter</kbd> to
          post,{" "}
          <kbd className="bg-muted rounded px-1 font-mono">Shift + Enter</kbd>{" "}
          for new line
        </p>
      </div>
    </div>
  );
};

export default CommentInput;
