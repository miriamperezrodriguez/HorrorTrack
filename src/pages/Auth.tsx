
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Redirigir cuando el usuario esté autenticado
  useEffect(() => {
    if (user && !authLoading) {
      console.log("Usuario autenticado detectado, redirigiendo al dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        console.log("Intentando iniciar sesión con:", email);
        const { data, error } = await signIn(email, password);
        
        if (error) {
          console.log("Error en login:", error);
          toast({
            title: "Error al iniciar sesión",
            description: error.message,
            variant: "destructive",
          });
        } else if (data?.user) {
          console.log("Login exitoso:", data.user);
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente",
          });
          
          // Para el superadmin, redirigir inmediatamente
          if (email === "admin@horrortrack.com") {
            console.log("Superadmin detectado, redirigiendo inmediatamente");
            navigate("/dashboard", { replace: true });
          }
        }
      } else {
        const { error } = await signUp(email, password, username);
        
        if (error) {
          toast({
            title: "Error al registrarse",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "¡Registro exitoso!",
            description: "Por favor revisa tu email para confirmar tu cuenta",
          });
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error("Error en autenticación:", error);
      toast({
        title: "Error",
        description: "Algo salió mal. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-red-600 mb-2 horror-title">
              HORRORTRACK
            </h1>
            <p className="text-gray-400">
              {isLogin ? "Inicia sesión en tu cuenta" : "Crea tu cuenta"}
            </p>
            
            {/* Mostrar credenciales de admin solo en desarrollo */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-700 rounded text-xs text-gray-300">
                <p className="font-semibold mb-1">Credenciales de Admin:</p>
                <p>Email: admin@horrortrack.com</p>
                <p>Password: admin123</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <Label htmlFor="username" className="text-white">
                  Nombre de usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Cargando..." : isLogin ? "Iniciar Sesión" : "Registrarse"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            </p>
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-500 hover:text-red-400"
            >
              {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-gray-600 text-gray-300"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
