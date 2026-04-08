import { LoaderIcon, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

import { useForm } from "react-hook-form";
import {
  userForgotPasswordValidator,
  type UserForgotPasswordData,
} from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import axios from "axios";

const ForgotPasswordPending = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserForgotPasswordData>({
    resolver: zodResolver(userForgotPasswordValidator),
  });
  const onSubmit = async (data: UserForgotPasswordData) => {
    try {
      setIsSubmitting(true);
      const res = await api.post("/auth/forgot-password", data);
      toast.success(res.data || "Reset link sent to your email!", {
        position: "top-center",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Failed to send reset link. Please try again later.",
          { position: "top-center" },
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 md:min-h-screen">
      <Card className="border-border mx-auto w-full max-w-md gap-2 py-3 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password!</CardTitle>
          <p className="text-muted-foreground text-sm">
            no worries we will send you a reset link.
          </p>
        </CardHeader>
        <form
          className="mt-0 space-y-4 px-4 py-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-start justify-center gap-2.5">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-xs font-medium">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div className="mx-2 space-y-1">
            <Button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderIcon className="size-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Reset Link</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPasswordPending;
