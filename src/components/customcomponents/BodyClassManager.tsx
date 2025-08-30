import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BodyClassManager = () => {
  const location = useLocation();

  useEffect(() => {
    const isAuthRoute = location.pathname.startsWith("/auth");

    if (isAuthRoute) {
      document.body.classList.add("auth-body");
    } else {
      document.body.classList.remove("auth-body");
    }
  }, [location.pathname]);

  return null;
};

export default BodyClassManager;
