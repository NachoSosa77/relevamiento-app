/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useUser.ts
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
        if (!res.ok) throw new Error("Error al obtener el usuario");
        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        setError("No se pudo obtener el usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
