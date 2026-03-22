import { useForm } from "react-hook-form";
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
import { Link, useNavigate } from "react-router-dom";
import { type UserLoginData, userLoginValidator } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/store/authStore";
import axios from "axios";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const login = useAuth((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserLoginData>({
    resolver: zodResolver(userLoginValidator),
  });

  const onSubmit = async (data: UserLoginData) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", data);
      login(res.data.data.user, res.data.data.accessToken);
      console.log(res.data);
      toast.success(res.data?.message, { position: "top-center" });
      return navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed", {
          position: "top-center",
        });
      } else {
        toast.error("An unexpected error occurred", {
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
      reset();
    }
  };
  return (
    <div className="bg-background text-foreground flex w-full items-center justify-center md:divide-x md:divide-neutral-200/30">
      <div className="hidden min-h-screen w-1/2 lg:flex lg:items-center lg:justify-center">
        <div className="flex flex-col items-center gap-6">
          <h1 className="max-w-2xl text-center text-4xl leading-relaxed font-bold tracking-tight">
            Share Your Thoughts{" "}
            <span className="bg-linear-to-r from-sky-500 via-sky-400 to-sky-300 bg-clip-text text-transparent">
              Connect
            </span>{" "}
            With The World
          </h1>
          <img
            src="../../../images/social.webp"
            alt="Login"
            className="h-80 w-100 object-cover"
          />
        </div>
      </div>
      <div className="flex min-h-screen w-full items-center justify-center p-4 lg:w-1/2">
        <Card className="border-accent-foreground/30 w-full max-w-sm border">
          <CardHeader className="flex flex-col items-center gap-3">
            <div className="flex items-center">
              <img
                src="../../../images/SocialXLogo1.png"
                alt="SocialX"
                className="h-9 w-auto object-cover"
              />
            </div>

            <CardTitle className="text-center text-xl">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-center">
              Welcome back! Please enter your details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-muted-foreground text-sm hover:text-neutral-200 hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    {...register("password", { required: true })}
                    className={`${errors.password ? "border-destructive" : ""}`}
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
                  className="bg-primary text-primary-foreground w-full cursor-pointer font-medium hover:bg-neutral-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Logging in" : "Login"}
                  {loading && <Spinner data-icon="inline-start" />}
                </Button>
                <p className="text-muted-foreground mt-4 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-neutral-200 hover:underline"
                  >
                    Sign up
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

export default LoginForm;
