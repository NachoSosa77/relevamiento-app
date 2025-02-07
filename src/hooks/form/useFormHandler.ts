import { RootStateUsuario } from "@/features/store";
import { apiForms } from "@/interfaces/api.interfaces/ApiForms";
import {
  deleteItem,
  editItem,
  fetchFormConfig,
  submitFormData,
} from "@/services/formService";
import { IUsuario } from "@/utils/auth";
import { addPersonal } from "@/utils/transformedDataPersonal";
import { addSector } from "@/utils/transformedDataSector";
import { addTransporte } from "@/utils/transformedDataTransporte";
import { addUbicacion } from "@/utils/transformedDataUbicacion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormGenericData } from "./useFormData";

import { addClient } from "@/utils/transformedDataCliente";
import { addProveedor } from "@/utils/transformedDataProveedor";
import { addProducto } from "@/utils/trasnformedDataProducto";




export const useFormHandler = (element: string) => {
  const [formConfig, setFormConfig] = useState<apiForms | null>(null);
  const [items, setItems] = useState<FormGenericData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch(); // Inicializa el dispatch
  const usuario = useSelector((state: RootStateUsuario) => state.usuario); // Obtiene el usuario del estado

  // Mapa de transformaciones
  const dataTransformers: Record<string, (formData: FormGenericData | null, usuario: IUsuario) => Promise<FormGenericData | null>> = {
    "org-ubicacion": addUbicacion,
    "org-sector": addSector,
    "org-personal": addPersonal,
    "org-proveedor": addProveedor,
    "org-transporte": addTransporte,
    "org-producto": addProducto,
    "org-cliente": addClient,
    "org-chofer": addPersonal,
  };

  console.log('ELEMENT', element)

  // Obtener formConfig
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await fetchFormConfig(element);
        setFormConfig(config);
      } catch (error) {
        console.error("Error al obtener la configuración del formulario", error);
        setError("Error al obtener la configuración del formulario");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [element]);

  const handleSubmit = async (formData: FormGenericData | null) => {
    setSubmitLoading(true);
    setError(null);
    console.log('element', element);

    try {
      // Aplicar transformación si existe una función para el elemento
      if (dataTransformers[element]) {
        formData = await dataTransformers[element](formData, usuario!);
      }

      console.log("Data handler", formData);

      const saveUrl = formConfig?.member[0]?.saveUrl || "";
      if (!saveUrl) throw new Error("No se encontró la URL de guardado");

      if (formData != null) {
        const savedItem = await submitFormData(saveUrl, formData);
        setItems((prevItems) => [...prevItems, savedItem]);
      }
    } catch (err) {
      console.error("Error al enviar los datos del formulario Handler:", err);
      setError("Error al enviar los datos del formulario");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = async (itemId: string, formData: FormGenericData) => {
    setSubmitLoading(true);
    setError(null);

    try {
      const saveUrl = formConfig?.member[0]?.saveUrl || "";
      if (!saveUrl) throw new Error("No se encontró la URL de guardado");
      await editItem(itemId, saveUrl, formData);
    } catch (error) {
      console.error("Error al editar el elemento:", error);
      setError("Error al editar el elemento");
    } finally {
      setSubmitLoading(false);
    }
  }
  const handleDelete = async (itemId: number) => {
    setSubmitLoading(true);
    setError(null);

    try {
      const saveUrl = formConfig?.member[0]?.saveUrl || "";
      if (!saveUrl) throw new Error("No se encontró la URL de guardado");

      await deleteItem(saveUrl, itemId);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error al eliminar el elemento:", err);
      setError("Error al eliminar el elemento");
    } finally {
      setSubmitLoading(false);
    }
  };

  return {
    formConfig,
    items,
    loading,
    submitLoading,
    error,
    handleSubmit,
    handleEdit,
    handleDelete,
  };
};
