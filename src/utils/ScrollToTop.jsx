import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }) => {
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0 });
  };

  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  return children;
};

export { ScrollToTop };
