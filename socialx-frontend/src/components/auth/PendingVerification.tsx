import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, RefreshCw } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import axios from "axios";

const PendingVerification = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";

  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Handle the 60-second countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);

      await api.post("/auth/resend-email-verification", { email });

      toast.success("Verification email resent!");
      setCountdown(60);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Failed to resend email. Please try again later.",
        );
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-md">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <Mail className="text-primary h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
          <CardDescription className="text-base">
            We've sent a verification link to <br />
            <span className="text-foreground font-medium">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="text-muted-foreground space-y-4 text-center text-sm">
          <p>
            Click the link in the email to verify your account. If you don't see
            it, check your spam or promotions folder.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            onClick={handleResendEmail}
            disabled={countdown > 0 || isResending}
          >
            {isResending ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : countdown > 0 ? (
              `Resend Email (${countdown}s)`
            ) : (
              "Resend Email"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PendingVerification;
