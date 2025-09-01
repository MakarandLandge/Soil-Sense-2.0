import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/60 to-background">
      <div className="text-center px-6">
        <h1 className="text-6xl font-extrabold tracking-tight text-primary">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">Oops! Page not found</p>
        <a
          href="/"
          className="inline-flex mt-6 items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
