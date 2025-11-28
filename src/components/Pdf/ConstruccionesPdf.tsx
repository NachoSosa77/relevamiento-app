/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import EstadoConservacionDetailComponent from "./EstadoConservacionPdf";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1A202C",
    backgroundColor: "#FAFAFA",
  },
  tabla: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    marginTop: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottom: "1pt solid #CBD5E0",
  },
  headerTextContainer: {
    flex: 1,
    textAlign: "right",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  headerText: {
    fontSize: 10,
    textAlign: "right",
    marginBottom: 2,
  },
  logo: {
    width: 180,
    height: 120,
    objectFit: "contain",
  },
  section: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#E9F0F7",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 8,
    textTransform: "uppercase",
    borderBottom: "1pt solid #CBD5E0",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    fontSize: 10,
    marginBottom: 6,
  },
  tableContainer: {
    marginTop: 6,
    border: "1pt solid #CBD5E0",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4, // antes: 2
    paddingHorizontal: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: "#CBD5E0",
  },
  tableHeaderCell: {
    width: "25%", // o ajustá dinámicamente
    padding: 6,
    backgroundColor: "#EDF2F7",
    fontWeight: "bold",
    fontSize: 9,
    borderRight: "1pt solid #CBD5E0",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    fontSize: 9,
    borderRight: "1pt solid #E2E8F0",
  },
  labelCell: {
    paddingVertical: 4,
    justifyContent: "center",
    fontSize: 10,
    fontWeight: "bold",
    width: "45%",
    color: "#333",
  },
  valueCell: {
    paddingVertical: 4,
    justifyContent: "center",
    fontSize: 10,
    width: "55%",
    textAlign: "right",
    color: "#000",
  },
  subSectionTitle: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "bold",
    color: "#4A5568",
    marginBottom: 4,
    borderBottom: "1pt solid #CBD5E0",
    paddingBottom: 2,
  },
  subTitle: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "bold",
    color: "#4A5568",
    marginBottom: 4,
    paddingBottom: 2,
    alignItems: "center",
    textAlign: "center",
  },
});

// 🔧 MODIFICADA: se ocultan id, relevamiento_id y construccion_id
const renderCamposConValor = (
  obj: Record<string, any>,
  etiquetas?: Record<string, string>
) => {
  const ocultarCampos = ["id", "relevamiento_id", "construccion_id"];

  const visibles = Object.entries(obj).filter(([key, valor]) => {
    if (ocultarCampos.includes(key)) return false;
    if (valor === null || valor === undefined) return false;
    if (typeof valor === "string" && valor.trim() === "") return false;
    if (typeof valor === "number" && valor === 0) return false;
    return true;
  });

  return visibles.map(([key, value]) => (
    <View key={key} style={styles.tableRow}>
      <Text style={styles.labelCell}>
        {etiquetas?.[key] ?? key.replace(/_/g, " ")}:
      </Text>
      <Text style={styles.valueCell}>{String(value)}</Text>
    </View>
  ));
};

// Normaliza valores JSON (string / array / null) a SIEMPRE un array de strings
const toArray = (value: any): string[] => {
  if (!value) return [];

  // Ya es un array
  if (Array.isArray(value)) return value;

  // Si viene como Buffer u objeto raro, intentamos toString
  if (value instanceof Buffer) {
    try {
      const str = value.toString("utf8");
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [str];
    } catch {
      return [value.toString("utf8")];
    }
  }

  // Si viene como string con JSON
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
      // Si el JSON no es array (por ejemplo objeto), lo devolvemos como string plano
      return [trimmed];
    } catch {
      // No es JSON válido, lo tratamos como string simple
      return [trimmed];
    }
  }

  // Cualquier otro tipo raro
  return [String(value)];
};

export const ConstruccionPdf = ({ data }: { data: any }) => {
  const { relevamiento, construcciones } = data;

  // Helper to render arrays of items for locals, e.g. aberturas, acondicionamiento, etc.

  return (
    <>
      {construcciones?.length > 0 &&
        construcciones.map((c: any) => (
          <Page style={styles.page} key={c.id}>
            {/* <View style={styles.header}>
              <Image src={logoUrl} style={styles.logo} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>
                  CFI (Consejo Federal de Inversiones).
                </Text>
                <Text style={styles.headerText}>
                  Proyecto: Relevamiento de la infraestructura educativa
                </Text>
                <Text style={styles.headerText}>
                  Zona 2 - Departamentos: Capital, Toay, Catriló y Atreuco.
                </Text>
                <Text style={styles.headerText}>
                  EX-2024-00069131-CFI-GES#DC
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.title}>Resumen del Relevamiento</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeaderCell}>N°: Relevamiento</Text>
                  <Text style={styles.tableHeaderCell}>Estado:</Text>
                  <Text style={styles.tableHeaderCell}>Email:</Text>
                </View>
                <View key={relevamiento.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{relevamiento?.id}</Text>
                  <Text style={styles.tableCell}>{relevamiento?.estado}</Text>
                  <Text style={styles.tableCell}>{relevamiento?.email}</Text>
                </View>
              </View>
            </View> */}

            <View style={styles.section}>
              <Text style={styles.title}>Construcciones</Text>
            </View>

            <View key={c.id} style={styles.section}>
              <Text style={styles.title}>
                CUI(Código unico de infraestructura): {relevamiento.cui_id}
                Construcción N° {c.numero_construccion}
              </Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeaderCell}>Destino:</Text>
                  <Text style={styles.tableHeaderCell}>Antigüedad:</Text>
                  <Text style={styles.tableHeaderCell}>
                    Superficie semi cubierta:
                  </Text>
                  <Text style={styles.tableHeaderCell}>
                    Superficie cubierta:
                  </Text>
                  <Text style={styles.tableHeaderCell}>Superficie Total:</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{c.destino}</Text>
                  <Text style={styles.tableCell}>{c.antiguedad}</Text>
                  <Text style={styles.tableCell}>
                    {c.superficie_semi_cubierta
                      ? `${c.superficie_semi_cubierta} m²`
                      : "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {c.superficie_cubierta
                      ? `${c.superficie_cubierta} m²`
                      : "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {c.superficie_total ? `${c.superficie_total} m²` : "-"}
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableHeaderCell}>Observaciones</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{c.observaciones}</Text>
                </View>
              </View>
              {/* Instituciones */}
              {c.instituciones?.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.subSectionTitle}>Instituciones</Text>

                  {/* Encabezado de tabla */}
                  <View style={styles.tableRow}>
                    <Text style={styles.tableHeaderCell}>Institución</Text>
                    <Text style={styles.tableHeaderCell}>Cue</Text>
                  </View>

                  {/* Filas de datos */}
                  {c.instituciones.map((ins: any, i: number) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={styles.tableCell}>
                        {ins.institucion ?? "-"}
                      </Text>
                      <Text style={styles.tableCell}>{ins.cue ?? "-"}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Plantas */}
              {c.plantas?.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.subSectionTitle}>Plantas</Text>

                  {/* Encabezado de tabla */}
                  <View style={styles.tableRow}>
                    <Text style={styles.tableHeaderCell}>Subsuelo</Text>
                    <Text style={styles.tableHeaderCell}>Planta baja</Text>
                    <Text style={styles.tableHeaderCell}>Pisos superiores</Text>
                    <Text style={styles.tableHeaderCell}>Total plantas</Text>
                  </View>

                  {/* Filas de datos */}
                  {c.plantas.map((plan: any, i: number) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={styles.tableCell}>
                        {plan.subsuelo ?? "-"}
                      </Text>
                      <Text style={styles.tableCell}>{plan.pb ?? "-"}</Text>
                      <Text style={styles.tableCell}>
                        {plan.pisos_superiores ?? "-"}
                      </Text>
                      <Text style={styles.tableCell}>
                        {plan.total_plantas ?? "-"}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={{ marginTop: 8 }}>
                <Text style={styles.subTitle}>SERVICIOS BÁSICOS</Text>
              </View>
              {/* Servicio Agua */}
              {c.servicioAgua?.length > 0 && (
                <View
                  style={{
                    marginTop: 8,
                    backgroundColor: "#fff",
                    padding: 6,
                    borderRadius: 4,
                  }}
                >
                  <Text style={styles.subSectionTitle}>AGUA</Text>

                  {c.servicioAgua.map((cond: any, i: number) => {
                    const tipoProvision = toArray(cond.tipo_provision);
                    const tipoProvisionEstado = toArray(
                      cond.tipo_provision_estado
                    );
                    const tipoAlmacenamiento = toArray(
                      cond.tipo_almacenamiento
                    );
                    const tipoAlmacenamientoEstado = toArray(
                      cond.tipo_almacenamiento_estado
                    );
                    const alcance = toArray(cond.alcance);

                    return (
                      <View key={i} style={{ marginBottom: 8 }}>
                        {/* Provisión */}
                        {tipoProvision.map((prov: string, idx: number) => (
                          <View key={`prov-${idx}`} style={styles.tableRow}>
                            <Text style={styles.labelCell}>Provisión:</Text>
                            <Text style={styles.valueCell}>{prov || "-"}</Text>
                          </View>
                        ))}

                        {/* Estado de provisión */}
                        {tipoProvisionEstado.map(
                          (estado: string, idx: number) => (
                            <View
                              key={`prov-estado-${idx}`}
                              style={styles.tableRow}
                            >
                              <Text style={styles.labelCell}>
                                Estado de provisión:
                              </Text>
                              <Text style={styles.valueCell}>
                                {estado || "-"}
                              </Text>
                            </View>
                          )
                        )}

                        {/* Tipo de almacenamiento + estado */}
                        {tipoAlmacenamiento.map((tipo: string, idx: number) => (
                          <View key={`alm-${idx}`} style={{ marginBottom: 4 }}>
                            <View style={styles.tableRow}>
                              <Text style={styles.labelCell}>
                                Tipo de almacenamiento:
                              </Text>
                              <Text style={styles.valueCell}>
                                {tipo || "-"}
                              </Text>
                            </View>
                            <View style={styles.tableRow}>
                              <Text style={styles.labelCell}>
                                Estado del almacenamiento:
                              </Text>
                              <Text style={styles.valueCell}>
                                {tipoAlmacenamientoEstado[idx] || "-"}
                              </Text>
                            </View>
                          </View>
                        ))}

                        {/* Alcance */}
                        {alcance.length > 0 && (
                          <View style={styles.tableRow}>
                            <Text style={styles.labelCell}>Alcance:</Text>
                            <Text style={styles.valueCell}>
                              {alcance.join(", ")}
                            </Text>
                          </View>
                        )}

                        {/* Otros campos simples */}
                        <View style={styles.tableRow}>
                          <Text style={styles.labelCell}>
                            Tratamiento potabilizador:
                          </Text>
                          <Text style={styles.valueCell}>
                            {cond.tratamiento ?? "-"}
                          </Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={styles.labelCell}>
                            Tipo de tratamiento:
                          </Text>
                          <Text style={styles.valueCell}>
                            {cond.tipo_tratamiento ?? "-"}
                          </Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={styles.labelCell}>
                            Control sanitario:
                          </Text>
                          <Text style={styles.valueCell}>
                            {cond.control_sanitario ?? "-"}
                          </Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={styles.labelCell}>
                            Cantidad de veces:
                          </Text>
                          <Text style={styles.valueCell}>
                            {cond.cantidad_veces ?? "-"}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Servicio Desagues Cloacales */}
              {c.servicioDesague?.length > 0 && (
                <View
                  style={{
                    marginTop: 8,
                    backgroundColor: "#fff",
                    padding: 6,
                    borderRadius: 4,
                  }}
                >
                  <Text style={styles.subSectionTitle}>DESAGÜES CLOACALES</Text>

                  {c.servicioDesague.map((cond: any, i: number) => (
                    <View key={i} style={{ marginBottom: 8 }}>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Tipo de provisión:</Text>
                        <Text style={styles.valueCell}>
                          {cond.servicio ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Estado:</Text>
                        <Text style={styles.valueCell}>
                          {cond.estado ?? "-"}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Servicio Gas */}
              {c.servicioGas?.length > 0 && (
                <View
                  style={{
                    marginTop: 8,
                    backgroundColor: "#fff",
                    padding: 6,
                    borderRadius: 4,
                  }}
                >
                  <Text style={styles.subSectionTitle}>
                    INSTALACIÓN DE GAS U OTRO COMBUSTIBLE
                  </Text>

                  {c.servicioGas.map((cond: any, i: number) => (
                    <View key={i} style={{ marginBottom: 8 }}>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Tipo de provisión:</Text>
                        <Text style={styles.valueCell}>
                          {cond.servicio ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Estado:</Text>
                        <Text style={styles.valueCell}>
                          {cond.estado ?? "-"}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Instalaciones seguridad incendio */}
              {c.instalacionesSeguridadIncendio?.length > 0 && (
                <View
                  style={{
                    marginTop: 8,
                    backgroundColor: "#fff",
                    padding: 6,
                    borderRadius: 4,
                  }}
                  break
                >
                  <Text style={styles.subSectionTitle}>
                    INSTALACIONES DE SEGURIDAD Y CONTRA INCENDIOS
                  </Text>

                  {c.instalacionesSeguridadIncendio.map(
                    (cond: any, i: number) => (
                      <View key={i} style={{ marginBottom: 8 }}>
                        {renderCamposConValor(cond, {
                          servicio: "Servicio",
                          estado: "Estado",
                          disponibilidad: "Disponibilidad",
                          cantidad: "Cantidad",
                          carga_anual_matafuegos: "Carga anual de matafuegos",
                          simulacros_evacuacion: "Simulacros de evacuación",
                        })}
                      </View>
                    )
                  )}
                </View>
              )}

              {/* Condiciones de accesibilidad */}
              {c.condicionesAccesibilidad?.length > 0 && (
                <View
                  style={{
                    marginTop: 8,
                    backgroundColor: "#fff",
                    padding: 6,
                    borderRadius: 4,
                  }}
                >
                  <Text style={styles.subSectionTitle}>
                    CONDICIONES DE ACCESIBILIDAD
                  </Text>

                  {c.condicionesAccesibilidad.map((cond: any, i: number) => (
                    <View key={i} style={{ marginBottom: 8 }}>
                      {renderCamposConValor(cond, {
                        servicio: "Servicio",
                        disponibilidad: "Disponibilidad",
                        estado: "Estado",
                        cantidad: "Cantidad",
                        mantenimiento: "Mantenimiento",
                      })}
                    </View>
                  ))}
                </View>
              )}

              {/* Servicio Electricidad */}
              {/* Servicio Electricidad */}
              {c.servicioElectricidad?.length > 0 && (
                <View
                  style={{
                    marginTop: 8,
                    backgroundColor: "#fff",
                    padding: 6,
                    borderRadius: 4,
                  }}
                >
                  <Text style={styles.subSectionTitle}>ELECTRICIDAD</Text>

                  {c.servicioElectricidad.map((cond: any, i: number) => (
                    <View key={i} style={{ marginBottom: 8 }}>
                      {renderCamposConValor(cond, {
                        servicio: "Servicio",
                        estado: "Estado",
                        disponibilidad: "Disponibilidad",
                        potencia: "Potencia (kW)",
                        estado_bateria: "Estado de la batería",
                        tipo_combustible: "Tipo de combustible",
                      })}
                    </View>
                  ))}
                </View>
              )}

              {/* Comedor */}
              {c.servicioComedor?.length > 0 && (
                <View
                  style={{
                    marginTop: 8,
                    backgroundColor: "#fff",
                    padding: 6,
                    borderRadius: 4,
                  }}
                  break
                >
                  <Text style={styles.subSectionTitle}>USO DEL COMEDOR</Text>

                  {c.servicioComedor.map((cond: any, i: number) => (
                    <View key={i} style={{ marginBottom: 8 }}>
                      {renderCamposConValor(cond, {
                        servicio: "Servicio",
                        disponibilidad: "Disponibilidad",
                        tipo_comedor: "Estado",
                      })}
                    </View>
                  ))}
                </View>
              )}

              {/* Energías alternativas */}
              {c.energiasAlternativas?.length > 0 && (
                <View
                  style={{
                    marginTop: 8,
                    backgroundColor: "#fff",
                    padding: 6,
                    borderRadius: 4,
                  }}
                >
                  <Text style={styles.subSectionTitle}>
                    ENERGÍAS ALTERNATIVAS
                  </Text>

                  {c.energiasAlternativas.map((ea: any, i: number) => (
                    <View key={i} style={{ marginBottom: 8 }}>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Disponibilidad</Text>

                        <Text style={styles.valueCell}>
                          {ea.disponibilidad ?? "-"}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Estado de conservación */}
              <EstadoConservacionDetailComponent c={c.estadoConservacion} />
            </View>
          </Page>
        ))}
    </>
  );
};
