import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background clay-texture">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-8xl md:text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-clay-dark">Page Not Found</h2>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Looks like this path has dried up like clay in the sun.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg"
        >
          <Home size={20} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
