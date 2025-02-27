/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormDataUser } from "@/interfaces/FormDataUser";
import axiosInstance from "@/utils/axiosInstance";
import axios, { AxiosError } from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface User {
  message: string;
  email: string,
  password: string,
  nombres: string,
  apellido: string,
}

interface AuthResponse {
  token: string;
  message: string;
}

export const register = async (formData: FormDataUser): Promise<User> => {
  try {
    const response = await axiosInstance.post(`${API_URL}/api/auth/register`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
    console.log('response:', response.data);
    return response.data;
  } catch (error) {
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
    const response = await axiosInstance.post(`${API_URL}/api/auth/login`, formData,);
    //console.log('response:', response.data);
    // Aquí podrías guardar el token en localStorage
    if (response.data.token) {
      Cookies.set('token', response.data.token, {expires: 7});
    }
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<AuthResponse>;
      if (axiosError.response) {
      console.error("Error del servidor:", axiosError.response?.status, axiosError.response?.data);
      throw new Error(axiosError.response?.data?.message || "Error en el inicio de sesión");
    } else {
      console.error("Error de red o no hay respuesta del servidor:", axiosError.message);
      throw new Error("Error en el inicio de sesión");
    }} else {
      console.error("Error desconocido:", error);
      throw new Error("Error en la solicitud de inicio de sesión");
    }
  } 
}

const logout = () => {
  localStorage.removeItem("token");
  Cookies.remove("token");
};

const getCurrentUser = () => {
  const token = Cookies.get('token');
  if (token) {
    try {
    const decoded = jwtDecode(token); // Decodifica el token JWT
    //console.log("Decoded token:", decoded);
    return decoded; // Devuelve la información decodificada del usuario
} catch (error) {
    console.error("Error al decodificar el token:", error);
    return null; // Si hay un error, el token es inválido
}
  }
  return null;
};

const authService = { // <-- Asigna el objeto a la variable authService
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService
