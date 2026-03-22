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
import { api } from "@/lib/axios";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationValidator),
  });

  const onSubmit = async (data: UserRegistrationData) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", data);
      console.log(res.data);
      if (res.data.success === true) {
        toast.success(res.data.message, {
          position: "top-center",
        });
        return navigate("/login");
      } else {
        setLoading(false);
        toast.error(
          res.data?.message || "Registration failed. Please try again",
          {
            position: "top-center",
          },
        );
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen divide-x-0 md:divide-x md:divide-neutral-200/30">
      <div className="hidden lg:flex lg:flex-col  lg:w-1/2 lg:justify-center lg:items-center ">
        <div className="flex flex-col items-center gap-6 px-4 py-40">
          <h1 className="text-4xl max-w-2xl text-center font-bold">
            Build Meaningful Connections
          </h1>
          <p className="text-2xl text-muted-foreground text-center">
            Join{" "}
            <span className=" mx-1.5 p-0.5 inline-block before:content-[''] before:-skew-10 z-10 before:-z-10 text-neutral-800 before:bg-neutral-300 before:h-full before:w-full relative before:absolute before:inset-0">
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
              className="w-110 h-80 object-cover"
            />
          </div>
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <Card className="w-full max-w-sm sm:max-w-md border border-accent-foreground/30 ">
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
                    className={`${errors.fullName ? "border-destructive " : ""}`}
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
                    className={`${errors.userName ? "border-destructive " : ""}`}
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
                    className={`${errors.email ? "border-destructive " : ""}`}
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
                    className={`${errors.password ? "border-destructive " : ""}`}
                    {...register("password", { required: true })}
                  />
                  {errors.password && (
                    <p className="text-destructive text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <CardFooter className="flex flex-col mt-5">
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-neutral-100 cursor-pointer "
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  {loading && <Spinner data-icon="inline-start" />}
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Already have an account?
                  <Link
                    to="/login"
                    className="hover:underline ml-1 text-neutral-200 "
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
