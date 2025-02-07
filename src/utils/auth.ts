import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import Cookies from "js-cookie";
import API_ROUTES from "./apiRoutes";


export interface IUsuario {
  id: number;
  email: string;
  roles: string[];
  firstlogin: boolean;
  personal: any;
  empresa: {
    id: number;
    descripcionAmplia: string;
    dadora: {
      id: number;
    }
  };
}

export interface IUserInfo {
  user: IUsuario;
}

interface IUserResponse {
  error: string;
  usuario?: IUsuario;
}



export const login = async (
  email: string,
  password: string
): Promise<IUserResponse> => {
  try {
    // Realizar la autenticación inicial
    const authResponse = await axiosInstance.post(API_ROUTES.auth.login, {
      username: email,
      password,
    });

    if (authResponse.status === 200) {
      const token = authResponse.data.token;

      // Obtener información del usuario autenticado
      const userResponse = await axiosInstance.get<IUserInfo>(API_ROUTES.auth.usuario, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/ld+json',
        },
      });

      const user = typeof userResponse.data.user === "string"
        ? JSON.parse(userResponse.data.user)
        : userResponse.data.user;

      // Verificar roles y empresa asociada
      if (user.roles.includes("ROL_ORG") && user.empresa != null) {
        // Almacenar el token
        localStorage.setItem("token", token);
        Cookies.set("token", token, { expires: 7 });

        console.log("mi return", user);


        return {
          error: "",
          usuario: user,
        };
      } else {
        logout(); // Lógica para cerrar sesión si no cumple con los requisitos
        return { error: "Unauthorized" };
      }
    }
  } catch (error: any) {
    // Manejar errores específicos de la API
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return { error: "Unauthorized" };
      }
      console.error("Error en la API:", error.response?.data || error.message);
    } else {
      console.error("Error desconocido:", error);
    }
  }

  return { error: "An error occurred" }; // Respuesta por defecto ante errores inesperados
};


export const passwordNeedsToBeChanged = async () => {
  try {
    const response = await axiosInstance.get("/api/usuario");

    if (response.status === 200) {
      return {
        success: true,
        passwordNeedsToBeChanged: response.data.passwordNeedsToBeChanged,
      };
    }
    return { success: false, passwordNeedsToBeChanged: false };
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "An error occurred" };
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const response = await axiosInstance.put("/api/change-password", {
      newPassword,
      confirmPassword: newPassword,
    });

    if (response.status === 200) {
      return { success: true };
    }
  } catch (error: any) {
    console.error("Update password error:", error);
    return { success: false, error: "Failed to update password" };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  Cookies.remove("token");
  localStorage.removeItem("email");
  Cookies.remove("email");
  localStorage.removeItem("menuItems");
  Cookies.remove("menuItems");
  console.log("Remove token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
