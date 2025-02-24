"use client";

import authService from "@/services/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export interface FormDataLogin {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
  nombre?: string;
  apellido?: string;
}

export default function SingInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataLogin>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length <= 10;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
          ? "La contraseña debe tener máximo 10 caracteres"
          : "",
      }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      setSuccess("¡Registro exitoso! Por favor, inicia sesión.");
      router.push("/login");
    } catch (error: any) {
      setErrors(error.message);
    }
    console.log("formData", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-dark.background dark:to-dark.secondary.DEFAULT py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark.card.DEFAULT p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-heading font-heading text-foreground dark:text-dark.foreground">
            Bienvenido
          </h2>
          <p className="mt-2 text-body text-accent-foreground dark:text-dark.accent.foreground">
            Registrate para luego poder acceder.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            
            <div className="relative">
              <label
                htmlFor="nombre"
                className="block text-sm font-body text-foreground dark:text-dark.foreground"
              >
                Nombre
              </label>
              <div className="mt-1 relative">
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  autoComplete="nombre"
                  required
                  className={`block w-full px-3 py-2 border text-black ${
                    errors.nombre
                      ? "border-destructive"
                      : "border-input dark:border-dark.input"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring dark:bg-dark.secondary.DEFAULT dark:text-dark.foreground`}
                  value={formData.nombre}
                  onChange={handleChange}
                  aria-invalid={errors.nombre ? "true" : "false"}
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="apellido"
                className="block text-sm font-body text-foreground dark:text-dark.foreground"
              >
                Apellido
              </label>
              <div className="mt-1 relative">
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  autoComplete="apellido"
                  required
                  className={`block w-full px-3 py-2 border text-black ${
                    errors.apellido
                      ? "border-destructive"
                      : "border-input dark:border-dark.input"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring dark:bg-dark.secondary.DEFAULT dark:text-dark.foreground`}
                  value={formData.apellido}
                  onChange={handleChange}
                  aria-invalid={errors.nombre ? "true" : "false"}
                />
              </div>
            </div>
            
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-body text-foreground dark:text-dark.foreground"
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
                value={formData.email}
                onChange={handleChange}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-body text-foreground dark:text-dark.foreground"
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
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-accent dark:text-dark.accent.DEFAULT" />
                  ) : (
                    <FaEye className="text-accent dark:text-dark.accent.DEFAULT" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            

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

            <div className="text-sm">
              <button type="button" className="font-body text-primary hover:text-primary/80 dark:text-dark.primary.DEFAULT">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div> */}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-body text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark.primary.DEFAULT dark:text-dark.primary.foreground"
            >
              {isLoading ? "Cargando..." : "Registrarse"}
            </button>
            {success && <p style={{ color: "green" }}>{success}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
