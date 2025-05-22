// hooks/useEquipamientoSanitario.ts
import axios from "axios";
import { useEffect, useState } from "react";

export interface EquipamientoSanitario {
  id: number;
  cantidad: number;
  cantidad_funcionamiento: number;
  estado: string;
  equipamiento: string;
}

export interface EquipamientoCocina {
  id: number;
  cantidad: number;
  cantidad_funcionamiento: number;
  equipamiento: string;
}

export interface MaterialesPredominantes {
  id: number;
  item: string;
  material: string;
  estado: string;
}

export interface Aberturas {
  id: number;
  abertura: string;
  tipo: string;
  cantidad: number;
  estado: string;
}

export interface IluminacionVentilacion {
  id: number;
  condicion: string;
  disponibilidad: string;
  superficie_iluminacion: number;
  superficie_ventilacion: number;
}

export interface CondicionTermica {
  id: number;
  temperatura: string;
  tipo: string;
  cantidad: number;
  disponibilidad: number;
}

export interface InstalacionesBasicas {
  id: number;
  servicio: string;
  tipo_instalacion: string;
  funciona: number;
  motivo: number;
}

export const useEquipamientoSanitario = (
  localId: number | undefined,
  relevamientoId: number | undefined
) => {
  const [data, setData] = useState<EquipamientoSanitario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localId || !relevamientoId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/equipamiento_sanitarios", {
          params: { localId, relevamientoId },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error al cargar equipamiento sanitario", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [localId, relevamientoId]);

  return { data, loading };
};

export const useMaterialesPredominantes = (
  localId: number | undefined,
  relevamientoId: number | undefined
) => {
  const [data, setData] = useState<MaterialesPredominantes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localId || !relevamientoId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/materiales_predominantes", {
          params: { localId, relevamientoId },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error al cargar equipamiento sanitario", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [localId, relevamientoId]);

  return { data, loading };
};

export const useAberturas = (
  localId: number | undefined,
  relevamientoId: number | undefined
) => {
  const [data, setData] = useState<Aberturas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localId || !relevamientoId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/aberturas", {
          params: { localId, relevamientoId },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error al cargar equipamiento sanitario", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [localId, relevamientoId]);

  return { data, loading };
};

export const useIluminacionVentilacion = (
  localId: number | undefined,
  relevamientoId: number | undefined
) => {
  const [data, setData] = useState<IluminacionVentilacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localId || !relevamientoId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/iluminacion_ventilacion", {
          params: { localId, relevamientoId },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error al cargar equipamiento sanitario", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [localId, relevamientoId]);

  return { data, loading };
};

export const useCondicionesTermicas = (
  localId: number | undefined,
  relevamientoId: number | undefined
) => {
  const [data, setData] = useState<CondicionTermica[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localId || !relevamientoId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/acondicionamiento_termico", {
          params: { localId, relevamientoId },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error al cargar equipamiento sanitario", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [localId, relevamientoId]);

  return { data, loading };
};

export const useInstalacionesBasicas = (
  localId: number | undefined,
  relevamientoId: number | undefined
) => {
  const [data, setData] = useState<InstalacionesBasicas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localId || !relevamientoId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/instalaciones_basicas", {
          params: { localId, relevamientoId },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error al cargar equipamiento sanitario", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [localId, relevamientoId]);

  return { data, loading };
};

export const useEquipamientoCocinaOficce = (
  localId: number | undefined,
  relevamientoId: number | undefined
) => {
  const [data, setData] = useState<EquipamientoCocina[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localId || !relevamientoId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/equipamiento_cocina_offices", {
          params: { localId, relevamientoId },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error al cargar equipamiento sanitario", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [localId, relevamientoId]);

  return { data, loading };
};
