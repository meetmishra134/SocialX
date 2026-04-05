import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import {
  userRegistrationValidator,
  type UserRegistrationData,
} from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { authService } from "@/services/auth.services";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationValidator),
  });

  const onSubmit = async (data: UserRegistrationData) => {
    try {
      setLoading(true);
      const res = await authService.register(data);
      console.log(res.data);
      toast.success(res.data?.message || "Registration successful", {
        position: "top-center",
      });
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      console.error("Registration failed:", error);
      if (error instanceof Error) {
        toast.error(error.message, { position: "top-center" });
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
      reset();
    }
  };
  return (
    <div className="flex min-h-screen divide-x-0 md:divide-x md:divide-neutral-200/30">
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center">
        <div className="flex flex-col items-center gap-6 px-4 py-40">
          <h1 className="max-w-2xl text-center text-4xl font-bold">
            Build Meaningful Connections
          </h1>
          <p className="text-muted-foreground text-center text-2xl">
            Join{" "}
            <span className="relative z-10 mx-1.5 inline-block p-0.5 text-neutral-800 before:absolute before:inset-0 before:-z-10 before:h-full before:w-full before:-skew-10 before:bg-neutral-300 before:content-['']">
              SocialX
            </span>
            {""}
            and start sharing ideas, discovering posts, and connecting with
            people worldwide.
          </p>
          <div>
            <img
              src="../../../images/register.webp"
              alt="Register"
              className="h-80 w-110 object-cover"
            />
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <Card className="border-accent-foreground/30 w-full max-w-sm border sm:max-w-md">
          <CardHeader className="flex flex-col items-center gap-3">
            <CardTitle className="text-center text-xl">
              Create your account
            </CardTitle>
            <CardDescription>
              Join SocialX and connect with peoples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    {...register("fullName", { required: true })}
                    className={`${errors.fullName ? "border-destructive" : ""}`}
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-xs">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    id="userName"
                    type="text"
                    placeholder="john_doe_123"
                    className={`${errors.userName ? "border-destructive" : ""}`}
                    {...register("userName", { required: true })}
                  />
                  {errors.userName && (
                    <p className="text-destructive text-xs">
                      {errors.userName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className={`${errors.email ? "border-destructive" : ""}`}
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    className={`${errors.password ? "border-destructive" : ""}`}
                    {...register("password", { required: true })}
                  />
                  {errors.password && (
                    <p className="text-destructive text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <CardFooter className="mt-5 flex flex-col">
                <Button
                  disabled={loading}
                  type="submit"
                  className="bg-primary text-primary-foreground w-full cursor-pointer hover:bg-neutral-100"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  {loading && <Spinner data-icon="inline-start" />}
                </Button>
                <p className="text-muted-foreground mt-4 text-sm">
                  Already have an account?
                  <Link
                    to="/login"
                    className="ml-1 text-neutral-200 hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;
