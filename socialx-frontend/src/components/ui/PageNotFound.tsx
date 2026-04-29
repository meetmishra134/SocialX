import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Ghost, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you have shadcn/ui Button

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="bg-muted/50 ring-background mb-8 flex h-32 w-32 items-center justify-center rounded-full ring-8"
      >
        <Ghost className="text-muted-foreground h-16 w-16" strokeWidth={1.5} />
      </motion.div>

      {/* 2. The Typography */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-foreground mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          404
        </h1>
        <h2 className="text-foreground mb-4 text-2xl font-bold">
          This page is a ghost town.
        </h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-md">
          The user, post, or link you're looking for doesn't exist. They might
          have deleted it, or you might have taken a wrong turn.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center"
      >
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft size={18} />
          Go Back
        </Button>

        <Button size="lg" asChild className="gap-2">
          <Link to="/">
            <Home size={18} />
            Back to Feed
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default PageNotFound;
