import { useEffect } from "react";

export const useDocumentTitle = (title: string, fallbackTitle = "SocialX") => {
  useEffect(() => {
    document.title = title ? `${title} | ${fallbackTitle}` : fallbackTitle;

    return () => {
      document.title = fallbackTitle;
    };
  }, [title, fallbackTitle]);
};
