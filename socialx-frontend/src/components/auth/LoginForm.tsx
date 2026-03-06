import { motion } from "motion/react";
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
import { Link } from "react-router-dom";

const LoginForm = () => {
  const MotionButton = motion.create(Button);
  return (
    <div className="bg-background text-foreground  items-center justify-center w-full flex md:divide-x md:divide-neutral-200/30 ">
      <div className="min-h-screen lg:flex lg:justify-center lg:items-start py-35  w-1/2 hidden ">
        <div className="flex flex-col items-center gap-6 ">
          <h1 className="text-4xl max-w-2xl text-center leading-relaxed tracking-tight font-medium">
            Share Your Thoughts{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-400 to-sky-300">
              Connect
            </span>{" "}
            With The World
          </h1>
          <img
            src="../../../images/social.webp"
            alt="Login"
            className="w-100 h-80 object-cover"
          />
        </div>
      </div>
      <div className="min-h-screen lg:w-1/2 w-full flex  items-center justify-center p-4">
        <Card className="w-full max-w-md sm:max-w-sm border border-accent-foreground/30 ">
          <CardHeader className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 mb-2">
              <img
                src="../../../images/Logo.webp"
                alt="SocialX"
                className="h-6 w-auto"
              />
              <h2 className="text-md font-bold">SocialX</h2>
            </div>

            <CardTitle className="text-center text-xl">
              {" "}
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-center ">
              Welcome back! Please enter your details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="">
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
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
                    required
                  />
                </div>
              </div>
              <CardFooter className="flex flex-col mt-5">
                <MotionButton
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-neutral-100 "
                  type="submit"
                >
                  Login
                </MotionButton>
                <p className="text-sm text-muted-foreground mt-4">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="hover:underline text-neutral-200 "
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
