import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  userResetForgotPasswordValidator,
  type UserResetForgotPasswordData,
} from "@/types/auth.types";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get("token");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UserResetForgotPasswordData>({
    resolver: zodResolver(userResetForgotPasswordValidator),
  });
  const onSubmit = async (data: UserResetForgotPasswordData) => {
    try {
      setIsSubmitting(true);
      if (!token) {
        throw new Error("Reset token is missing. Please try again.");
      }
      const res = await api.post(`/auth/reset-password/${token}`, data);
      console.log(res.data);
      toast.success(res.data?.message || "Password reset successful", {
        position: "top-center",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
      reset();
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="border-border mx-auto w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <p className="text-muted-foreground text-sm">
            Please enter your new password below.
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 pt-0">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("newPassword")}
              />
              {/* Show/Hide Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-destructive text-xs font-medium">
                {errors.newPassword.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword", {
                  validate: (val) => {
                    if (watch("newPassword") !== val) {
                      return "Passwords do not match";
                    }
                  },
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-xs font-medium">
                {errors.confirmPassword.message as string}
              </p>
            )}
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
