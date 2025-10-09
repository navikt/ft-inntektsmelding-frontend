import { useEffect } from "react";

export const useScrollToTopOnMount = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
};
