import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminRoute({ children }: Readonly<{ children: React.ReactNode }>) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated)  return <Navigate to="/login" replace />;
    if (!user?.isAdmin) return <Navigate to="/" replace />;

    return children;
}