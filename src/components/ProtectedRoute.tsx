
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute: Estado", { user: !!user, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute: Usuario no autenticado, redirigiendo a /auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("ProtectedRoute: Usuario autenticado, mostrando contenido");
  return <>{children}</>;
};

export default ProtectedRoute;
