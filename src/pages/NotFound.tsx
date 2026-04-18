import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.warn("404: route not found →", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <code className="inline-block text-xs text-muted-foreground bg-secondary px-2 py-1 rounded mb-8 break-all">
          {location.pathname}
        </code>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <Link
            to="/search"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors w-full sm:w-auto"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
        </div>

        <div className="mt-10 text-xs text-muted-foreground">
          Need help?{" "}
          <Link to="/support" className="text-primary hover:underline font-medium">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
