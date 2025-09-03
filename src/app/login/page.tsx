/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/api";

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  /* const [formData, setFormData] = useState<FormDataUser>({
    id: 0,
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  }); */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(false); // Asegura que este estado solo se modifique en el cliente
  }, []);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
  const maxLength = password.length <= 10;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return maxLength && hasUpperCase && hasNumber;
};

  /* const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Actualiza el valor del campo específico
    }));

    // Real-time validation
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: !validateEmail(value)
          ? "Por favor ingrese un correo válido"
          : "",
      }));
    }
    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: !validatePassword(value)
          ? "La contraseña debe tener al menos 8 caracteres"
          : "",
      }));
    }
  }; */
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email: !validateEmail(value) ? "Por favor ingrese un correo válido" : "",
    }));
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({
      ...prev,
      password: !validatePassword(value)
        ? "La contraseña debe tener hasta 10 caracteres, una mayúscula y un número"
        : "",
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccess(null);
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      const returnTo = searchParams.get("returnTo") || "/home";
      setSuccess("¡Bienvenido!");
      router.push(returnTo);
    } catch (error: any) {
      setErrors({
        general:
          error.response?.data?.message || error.message || "Error desconocido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-dark.background dark:to-dark.secondary.DEFAULT py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark.card.DEFAULT p-8 rounded-lg shadow-lg">
        <div className="flex justify-center">
          <Image
            src="/img/logo-ministerio.png"
            alt="Logo"
            width={350}
            height={100}
            priority
          />
        </div>
        <div className="text-center">
          <h2 className="text-heading font-heading text-custom dark:text-dark.foreground">
            Bienvenido
          </h2>
          <p className="text-body text-accent-foreground dark:text-dark.accent.foreground">
            Inicia sesión en tu cuenta
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-body text-custom dark:text-dark.foreground"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 block w-full px-3 py-2 border text-black ${
                  errors.email
                    ? "border-destructive"
                    : "border-input dark:border-dark.input"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring dark:bg-dark.secondary.DEFAULT dark:text-dark.foreground`}
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={handleChangeEmail}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-body text-custom dark:text-dark.foreground"
              >
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`block w-full px-3 py-2 border text-black ${
                    errors.password
                      ? "border-destructive"
                      : "border-input dark:border-dark.input"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring dark:bg-dark.secondary.DEFAULT dark:text-dark.foreground`}
                  value={password}
                  onChange={handleChangePassword}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-custom dark:text-dark.accent.DEFAULT" />
                  ) : (
                    <FaEye className="text-custom dark:text-dark.accent.DEFAULT" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            {errors.general && (
              <p className="mt-2 text-sm text-destructive">{errors.general}</p>
            )}

            {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-ring border-input dark:border-dark.input rounded"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-accent-foreground dark:text-dark.accent.foreground">
                Recordarme
              </label>
            </div>
                      </div>

            */}

            <div className="text-sm">
              <button
                type="button"
                className="font-body text-custom hover:text-custom/50 dark:text-dark.primary.DEFAULT"
                onClick={() => router.push("/forgot-password")}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-body text-primary-foreground bg-custom hover:bg-custom/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark.primary.DEFAULT dark:text-dark.primary.foreground"
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </button>
            {success && <p style={{ color: "green" }}>{success}</p>}
          </div>
        </form>
        <div className="flex flex-col items-center mt-6">
          <p className="text-sm text-muted-foreground">¿No tenés una cuenta?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            onClick={() => router.push("/signin")}
            className="mt-2 flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-custom rounded-xl shadow hover:shadow-lg transition-all"
          >
            Registrate acá
            <motion.span
              animate={{
                x: [0, 5, 0], // va hacia la derecha y vuelve
              }}
              transition={{
                repeat: Infinity,
                duration: 1.0,
                ease: "easeInOut",
              }}
              className="inline-block"
            >
              <FaArrowRight />
            </motion.span>
          </motion.button>
        </div>
        <div className="flex justify-end text-xs text-gray-400">V1.6 beta 03-09</div>
      </div>
    </div>
  );
}
