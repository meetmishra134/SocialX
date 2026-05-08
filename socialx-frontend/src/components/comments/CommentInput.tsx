import { useAuth } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { SendHorizontal, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useEditComment } from "@/hooks/useEditComment";

interface CommentInputProps {
  initialValue?: string;
  isEditMode?: boolean;
  commentId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const CommentInput = ({
  initialValue,
  isEditMode,
  commentId,
  onCancel,
  onSuccess,
}: CommentInputProps) => {
  const user = useAuth((state) => state.user);
  const { postId } = useParams() as { postId: string };
  const { mutate: createComment, isPending } = useCreateComment();
  const { mutate: editComment, isPending: isEditPending } = useEditComment();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      text: initialValue || "",
    },
  });

  useEffect(() => {
    if (location.state?.autoFocusComment || isEditMode) {
      setFocus("text");
    }
  }, [location.state, setFocus, isEditMode]);

  const onSubmit = (data: { text: string }) => {
    if (isEditMode && commentId) {
      editComment(
        { commentId, text: data.text },
        {
          onSuccess: () => {
            reset();
            onSuccess?.();
          },
        },
      );
    } else {
      createComment(
        { postId, comment: data.text },
        {
          onSuccess: () => {
            reset();
          },
        },
      );
    }
  };

  return (
    <div
      className={`flex w-full items-start gap-2 ${isEditMode ? "mt-2" : ""}`}
    >
      {/* FIX 3: Hide Avatar if in Edit Mode */}
      {!isEditMode && (
        <Avatar className="mt-1 h-7 w-7 sm:h-10 sm:w-10">
          <AvatarImage src={user?.avatarUrl?.url} alt={user?.userName} />
          <AvatarFallback>{user?.userName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-1 flex-col gap-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-muted/50 focus-within:border-border focus-within:bg-background relative flex items-center rounded-2xl border border-transparent p-1 shadow-sm transition-colors duration-200"
        >
          <Textarea
            placeholder={
              errors.text ? "Comment is required" : "Write a comment..."
            }
            className={`flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none disabled:opacity-50 sm:text-base ${
              errors.text ? "placeholder:text-destructive text-xs" : ""
            }`}
            {...register("text", {
              required: true,
              validate: (value) => value.trim().length > 0,
            })}
            disabled={isPending || isEditPending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
              // FIX 1: Use "Escape" instead of "ESC"
              if (e.key === "Escape" && isEditMode && onCancel) {
                onCancel();
              }
            }}
          />

          {/* FIX 2: Group buttons in a flex container so they don't overlap */}
          <div className="absolute right-2 bottom-1 flex items-center gap-1">
            {isEditMode && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={isEditPending}
                onClick={onCancel}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8 cursor-pointer rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <X className="size-4" />
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              disabled={isPending || isEditPending}
              className="text-primary hover:bg-primary/10 hover:text-primary h-8 w-8 cursor-pointer rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <SendHorizontal className="size-4" />
            </Button>
          </div>
        </form>

        <p className="text-muted-foreground ml-2 hidden text-[10px] sm:block">
          Press <kbd className="bg-muted rounded px-1 font-mono">Enter</kbd> to
          post,{" "}
          <kbd className="bg-muted rounded px-1 font-mono">Shift + Enter</kbd>{" "}
          for new line
          {isEditMode && (
            <>
              , <kbd className="bg-muted rounded px-1 font-mono">Esc</kbd> to
              cancel
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default CommentInput;
