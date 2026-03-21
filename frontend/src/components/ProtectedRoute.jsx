import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  // Prevent flashing logic while authenticating the JWT globally
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-dark-950 text-brand-violet">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  // Eject rendering entirely if unauthorized
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}