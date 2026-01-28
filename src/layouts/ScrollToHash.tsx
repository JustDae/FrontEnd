import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash(): null {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const scroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };

      const timer = setTimeout(scroll, 300);
      return () => clearTimeout(timer);
    }
  }, [hash, pathname]);

  return null;
}