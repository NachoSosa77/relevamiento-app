import { UserData } from "@/interfaces/UserData";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/get-user", { credentials: "include" });

        if (res.status === 401) {
          // No está logueado, no mostramos error
          setUser(null);
          setError(null);
        } else if (res.status === 404) {
          // No se encontró el usuario, puede ser que el token esté viejo
          setUser(null);
          setError(null);
        } else if (!res.ok) {
          throw new Error("Error al obtener el usuario");
        } else {
          const userData = await res.json();
          setUser(userData);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        setError("Error al obtener el usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
