import logo from "@/../public/Ministerio Educación_HORIZONTAL_COLOR.png";
import { UserData } from "@/interfaces/UserData";
import { resetArchivos } from "@/redux/slices/archivoSlice";
import { resetEspacioEscolar } from "@/redux/slices/espacioEscolarSlice";
import { persistor } from "@/redux/store";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AiOutlineHome,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineUser,
} from "react-icons/ai";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true); // Nuevo estado para evitar renders en blanco
  const dispatch = useDispatch();

  // Obtiene el usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/get-token", { credentials: "include" });
        const data = await res.json();
        //console.log("Token obtenido desde backend:", data.token);

        if (data.token) {
          const decodedUser: UserData = jwtDecode(data.token);
          setUser(decodedUser);
        }
      } catch (error) {
        console.error("Error obteniendo token:", error);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" }); // ⬅️ Llama al endpoint para borrar la cookie en el servidor
      dispatch(resetEspacioEscolar()); // <-- resetea el estado de espacio_escolar
      dispatch(resetArchivos());
      setUser(null);
      setShowLogoutModal(false);
      persistor.purge();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return null; // Evita que el navbar se renderice antes de obtener el usuario
  }

  return (
    <nav className="navbar fixed top-0 w-full z-50 transition-all duration-300 border bg-slate-200">
      <div className="max-w-8xl mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left section - Logo */}
          <div className="flex items-center">
            <Image src={logo} alt="Logo" width={300} height={100} />
          </div>

          <div className="hidden md:flex items-center space-x-4 ml-auto">
            {user && (
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <Link href="/home">
                    <AiOutlineHome className="h-9 w-9 ml-2 text-custom cursor-pointer" />
                  </Link>
                

                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                  aria-label="User menu"
                >
                  <AiOutlineUser className="h-9 w-9 rounded-full object-cover text-custom cursor-pointer" />
                </button>
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-card ring-1 ring-black ring-opacity-5">
                    <div className="flex justify-end pr-4">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        x
                      </button>
                    </div>
                    <div className="px-4 py-2 text-sm">
                      <p className="font-semibold">
                        {user.nombre} {user.apellido}
                      </p>
                      <p className="text-gray-400">{user.email}</p>
                    </div>
                    <hr className="border-border" />
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full text-left px-4 py-2 text-sm text-custom font-bold hover:bg-custom/50 transition-colors flex items-center space-x-2"
                    >
                      <AiOutlineLogout className="h-7 w-7 text-custom cursor-pointer" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-custom/50 transition-colors"
              aria-label="Main menu"
            >
              <AiOutlineMenu className="h-6 w-6 text-custom" />
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal (sin cambios) */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className="inline-block bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium">Cerrar Sesión</h3>
                <p className="text-gray-500">¿Deseas cerrar sesión?</p>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Cerrar Sesión
                  </button>
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 bg-gray-300 text-black rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
