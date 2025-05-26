/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export interface FormDataSignIn {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
  dni: string;
}

interface Errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  nombre?: string;
  apellido?: string;
  dni?: string;
}

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataSignIn>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    dni: ""
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => {
  const maxLength = password.length <= 10;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return maxLength && hasUpperCase && hasNumber;
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validación en tiempo real
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: !validateEmail(value) ? "Correo inválido" : "",
      }));
    }

    if (name === "password") {
  const isValid = validatePassword(value);
  setErrors((prev) => ({
    ...prev,
    password: !isValid
      ? "Máximo 10 caracteres, incluir mayúscula y número"
      : "",
  }));
}

    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: value !== formData.password
          ? "Las contraseñas no coinciden"
          : "",
      }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          apellido: formData.apellido,
          dni: formData.dni,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      setSuccess("Registro Correcto!");
      router.push("/login");
    } catch (error: any) {
      setErrors({ email: error.message });
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
          <h2 className="text-heading font-heading text-custom dark:text-dark.foreground">Bienvenido</h2>
          <p className="mt-2 text-body text-custom dark:text-dark.accent.foreground">
            Registrate para luego poder acceder.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">

            {["nombre", "apellido", "dni"].map((field) => (
              <div key={field} className="relative">
                <label
                  htmlFor={field}
                  className="block text-sm font-body text-custom dark:text-dark.foreground"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  name={field}
                  type="text"
                  required
                  className={`mt-1 block w-full px-3 py-2 border text-black ${
                    errors[field as keyof Errors]
                      ? "border-destructive"
                      : "border-input dark:border-dark.input"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring dark:bg-dark.secondary.DEFAULT dark:text-dark.foreground`}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div>
              <label htmlFor="email" className="block text-sm font-body text-custom dark:text-dark.foreground">Correo Electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`mt-1 block w-full px-3 py-2 border text-black ${
                  errors.email ? "border-destructive" : "border-input dark:border-dark.input"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring dark:bg-dark.secondary.DEFAULT dark:text-dark.foreground`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-body text-custom dark:text-dark.foreground">Contraseña</label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`block w-full px-3 py-2 border text-black ${
                    errors.password ? "border-destructive" : "border-input dark:border-dark.input"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring dark:bg-dark.secondary.DEFAULT dark:text-dark.foreground`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="text-custom"/> : <FaEye className="text-custom" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            {/* Confirmar contraseña */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-body text-custom dark:text-dark.foreground">Confirmar Contraseña</label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className={`block w-full px-3 py-2 border text-black ${
                    errors.confirmPassword ? "border-destructive" : "border-input dark:border-dark.input"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring dark:bg-dark.secondary.DEFAULT dark:text-dark.foreground`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash className="bg-custom" /> : <FaEye className="text-custom"/>}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-body text-primary-foreground bg-custom hover:bg-custom/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark.primary.DEFAULT dark:text-dark.primary.foreground"
            >
              Registrarse
            </button>
            {success && <p className="text-sm text-green-600">{success}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
