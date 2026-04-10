import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ✅ Show loader while auth state is being checked
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-dark-950 text-brand-violet" aria-label="Loading application">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  // ✅ Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ✅ Allow access if authenticated
  return children;
}
