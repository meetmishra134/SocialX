import { Link } from "react-router-dom";
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

const RegisterForm = () => {
  return (
    <div className="flex min-h-screen divide-x-0 md:divide-x md:divide-neutral-200/30">
      <div className="hidden lg:flex lg:w-1/2 justify-center items-start pt-30">
        <div className="flex flex-col items-center gap-6 px-4">
          <h1 className="text-4xl max-w-2xl mx-auto">
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
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <Card className="w-full max-w-md sm:max-w-sm border border-accent-foreground/30 ">
          <CardHeader className="flex flex-col items-center gap-3">
            <CardTitle className="text-center text-xl">
              Create your account
            </CardTitle>
            <CardDescription>
              Join SocialX and connect with peoples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="">
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    id="userName"
                    type="text"
                    placeholder="john_doe_123"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                  />
                </div>
              </div>
              <CardFooter className="flex flex-col mt-5">
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-neutral-100 "
                >
                  Create Account
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
