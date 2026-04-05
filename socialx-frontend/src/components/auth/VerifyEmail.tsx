import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/store/authStore";

const VerifyEmail = () => {
  const [status, setStatus] = useState<"Verifying" | "Success" | "Error">(
    "Verifying",
  );
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get("token");
  const checkAuth = useAuth((state) => state.checkAuth);
  const login = useAuth((state) => state.login);
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    const verifyEmail = async () => {
      if (!token) {
        setStatus("Error");
        return;
      }
      hasFired.current = true;
      try {
        const res = await api.get(`/auth/verify-email/${token}`);
        if (res.status === 200) {
          setStatus("Success");
          await checkAuth();
          setTimeout(() => {
            navigate("/feed/foryou");
          }, 2000);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            setStatus("Error");
          }
        }
      }
    };
    verifyEmail();
  }, [token, navigate, checkAuth, login]);

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="space-y-4">
          {status === "Verifying" && (
            <>
              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                {/* animate-spin makes the icon rotate continuously */}
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Verifying Email
              </CardTitle>
            </>
          )}

          {status === "Success" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Email Verified!
              </CardTitle>
            </>
          )}

          {status === "Error" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-600">
                Verification Failed
              </CardTitle>
            </>
          )}
        </CardHeader>

        <CardContent className="text-muted-foreground">
          {status === "Verifying" && (
            <p>
              Please wait a moment while we securely verify your email address.
            </p>
          )}

          {status === "Success" && (
            <p>Your account is ready. Redirecting you to the login page...</p>
          )}

          {status === "Error" && (
            <div className="space-y-4">
              <p>
                The link is invalid or has expired. Please request a new
                verification email.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Return to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
