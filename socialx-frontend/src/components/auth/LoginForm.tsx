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

import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/store/authStore";

import { authService } from "@/services/auth.services";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { api } from "@/lib/axios";
import axios from "axios";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
  useDocumentTitle("Login");
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });
      login(res.data.data.user);
      toast.success(res.data?.message, { position: "top-center" });
      navigate("/feed/foryou", {
        replace: true,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Google login failed. Please try again.",
          {
            position: "top-center",
          },
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UserLoginData) => {
    try {
      setLoading(true);
      const response = await authService.login(data);
      login(response.data.data.user);
      // console.log(response.data);
      toast.success(response.data?.message, { position: "top-center" });
      return navigate("/feed/foryou", {
        state: { email: data.email },
        replace: true,
      });
    } catch (error: unknown) {
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
            loading="lazy"
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
                    <p
                      className="text-muted-foreground cursor-pointer text-sm hover:text-neutral-200 hover:underline"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot?
                    </p>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      {...register("password", { required: true })}
                      className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-destructive text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <CardFooter className="mt-5 flex flex-col p-0">
                <Button
                  className="bg-primary text-primary-foreground w-full cursor-pointer font-medium hover:bg-neutral-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Logging in" : "Login"}
                  {loading && (
                    <Spinner data-icon="inline-start" className="ml-2" />
                  )}
                </Button>

                <div className="relative my-4 w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="border-border w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background text-muted-foreground px-2">
                      Or
                    </span>
                  </div>
                </div>

                <div className="flex w-full justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log("Login Failed")}
                    useOneTap
                    width="320"
                    size="large"
                    theme="filled_black"
                    text="continue_with"
                  />
                </div>

                <p className="text-muted-foreground mt-2.5 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-neutral-200 hover:underline"
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
