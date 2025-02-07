import { FormDataUser } from "@/interfaces/FormDataUser";
import axiosInstance from "@/utils/axiosInstance";
import axios, { AxiosError } from "axios";
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface User {
  email: string,
  password: string
}

interface AuthResponse {
  token: string;
}

export const register = async (formData: FormDataUser): Promise<User> => {
  try {
    const response = await axiosInstance.post(`${API_URL}/register`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
    console.log('response:', response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)){
      const axiosError = error as AxiosError<User>;
      if (axiosError.response){
        console.error("Error del servidor:", axiosError.response.status, axiosError.response.data);  // Log detallado
        throw new Error(axiosError.response.data.message || "Error en el registro"); // Lanza un error más descriptivo
      }else if (axiosError.request) {
        // No se recibió respuesta del servidor (problema de red)
        console.error("Error de red:", axiosError.message);
        throw new Error("No se pudo conectar con el servidor");
      } else {
        // Error en la configuración de la solicitud
        console.error("Error de configuración:", axiosError.message);
        throw new Error("Error en la solicitud de registro");
      }
    } else {
      // Otro tipo de error
      console.error("Error desconocido:", error);
      throw new Error("Error desconocido durante el registro");
    }
  }
};


export const login = async (formData: FormDataUser) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/login`, formData,);
    console.log('response:', response.data);
    // Aquí podrías guardar el token en localStorage
    if (response.data.token) {
      Cookies.set('token', response.data.token, {expires: 7});
    }
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<AuthResponse>;
      console.error("Error del servidor:", axiosError.response.status, axiosError.response.data);
      // Lanza un error con un mensaje más descriptivo
      throw new Error(axiosError.response.data.message || "Error en el inicio de sesión");
    } else if (axiosError.request) {
      console.error("Error de red:");
      throw new Error("No se pudo conectar con el servidor");
    } else {
      console.error("Error de configuración:")
      throw new Error("Error en la solicitud de inicio de sesión");
    }
  } 
}


const logout = () => {
  localStorage.removeItem('token');
};

const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Aquí podrías verificar y decodificar el token para obtener la información del usuario
    return { /* Información del usuario */ };
  }
  return null;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
