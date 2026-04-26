import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, RefreshCw, X } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/store/authStore";

const PendingVerification = () => {
  const { user, isVerifyPopupOpen, openVerifyPopup, closeVerifyPopup } =
    useAuth();
  const location = useLocation();
  const email = location.state?.email || user?.email || "your email";
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  useEffect(() => {
    if (!user || user.isEmailVerified) return;
    const lastSeen = localStorage.getItem("verifyPopupLastSeen");
    const INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
    if (!lastSeen || Date.now() - parseInt(lastSeen) > INTERVAL) {
      const timer = setTimeout(() => openVerifyPopup(), 3000);
      return () => clearTimeout(timer);
    }
  }, [user, openVerifyPopup]);

  const handleClose = () => {
    closeVerifyPopup();
    localStorage.setItem("verifyPopupLastSeen", Date.now().toString());
  };

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      await api.post("/auth/resend-email-verification", { email });
      toast.success("Verification email resent!");
      setCountdown(60);
    } catch (error: unknown) {
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
  if (!isVerifyPopupOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-md">
      <Card className="relative w-full max-w-md shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground absolute top-3 right-3"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <CardHeader className="mt-2 space-y-4 text-center">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <Mail className="text-primary h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome To SocialX
          </CardTitle>
          <CardDescription className="text-base">
            We have sent an email please verify to continue further <br />
            <span className="text-foreground font-medium">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="text-muted-foreground space-y-4 text-center text-sm">
          <p>
            Enjoy connecting with friends, sharing moments, and exploring new
            content on SocialX!
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

          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground text-sm hover:underline"
          >
            I'll do this later
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PendingVerification;
