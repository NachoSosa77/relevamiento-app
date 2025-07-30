/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import EstadoConservacionDetailComponent from "./EstadoConservacionPdf";
const logoUrl = "/img/logo-ministerio.png";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1A202C",
    backgroundColor: "#FAFAFA",
  },
  containerBox: {
    marginTop: 8,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tabla: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    marginTop: 6,
  },
  detailRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: "bold",
    width: "50%",
  },
  detailValue: {
    fontSize: 10,
    width: "50%",
    textAlign: "right",
  },
  fila: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 0.5,
    borderColor: "#CBD5E0",
  },
  celda: {
    borderWidth: 0.5,
    borderColor: "#CBD5E0",
    padding: 6,
    fontSize: 9,
    flex: 1,
    textAlign: "left",
  },
  encabezado: {
    backgroundColor: "#eee",
    fontWeight: "bold",
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
  label: {
    fontWeight: "bold",
    width: "40%",
    color: "#2D3748",
  },
  value: {
    width: "60%",
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
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "48%",
    marginBottom: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 120,
    objectFit: "cover",
    marginBottom: 4,
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
  localContainer: {
    marginBottom: 12,
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    border: "1pt solid #CBD5E0",
  },
  localHeader: {
    fontWeight: "bold",
    fontSize: 11,
    marginBottom: 6,
    color: "#2D3748",
  },
  localDetailsRow: {
    marginBottom: 2,
  },
  localDetailsLabel: {
    fontWeight: "bold",
    width: "40%",
    color: "#2D3748",
  },
  localDetailsValue: {
    width: "60%",
  },
  localSubListContainer: {
    marginBottom: 4,
  },
  localSubItem: {
    marginBottom: 2,
  },
});

export const ConstruccionPdf = ({ data }: { data: any }) => {
  
  const { relevamiento, construcciones } = data;

  // Helper to render arrays of items for locals, e.g. aberturas, acondicionamiento, etc.

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
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
            <Text style={styles.headerText}>EX-2024-00069131-CFI-GES#DC</Text>
          </View>
        </View>
        {/* Relevamiento */}
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
        </View>

        {/* Construcciones y Locales con detalle */}
        {construcciones?.length > 0 &&
          construcciones.map((c: any) => (
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

              <View style={{ marginTop: 8 }} break>
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

                  {c.servicioAgua.map((cond: any, i: number) => (
                    <View key={i} style={{ marginBottom: 8 }}>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Provisión:</Text>
                        <Text style={styles.valueCell}>
                          {cond.tipo_provision ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>
                          Estado de provisión:
                        </Text>
                        <Text style={styles.valueCell}>
                          {cond.tipo_provision_estado ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>
                          Tipo de almacenamiento:
                        </Text>
                        <Text style={styles.valueCell}>
                          {cond.tipo_almacenamiento ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>
                          Estado del almacenamiento:
                        </Text>
                        <Text style={styles.valueCell}>
                          {cond.tipo_almacenamiento_estado ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Alcance:</Text>
                        <Text style={styles.valueCell}>
                          {cond.alcance ?? "-"}
                        </Text>
                      </View>
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
                        <Text style={styles.labelCell}>Control sanitario:</Text>
                        <Text style={styles.valueCell}>
                          {cond.control_sanitario ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Cantidad de veces:</Text>
                        <Text style={styles.valueCell}>
                          {cond.cantidad_veces ?? "-"}
                        </Text>
                      </View>
                    </View>
                  ))}
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
                >
                  <Text style={styles.subSectionTitle}>
                    INSTALACIONES DE SEGURIDAD Y CONTRA INCENDIOS
                  </Text>

                  {c.instalacionesSeguridadIncendio.map(
                    (ins: any, i: number) => (
                      <View key={i} style={{ marginBottom: 8 }}>
                        <View style={styles.tableRow}>
                          <Text style={styles.labelCell}>Servicio:</Text>
                          <Text style={styles.valueCell}>
                            {ins.servicio ?? "-"}
                          </Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={styles.labelCell}>Disponibilidad:</Text>
                          <Text style={styles.valueCell}>
                            {ins.disponibilidad ?? "-"}
                          </Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={styles.labelCell}>Cantidad:</Text>
                          <Text style={styles.valueCell}>
                            {ins.cantidad ?? "-"}
                          </Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={styles.labelCell}>
                            Carga anual matafuegos:
                          </Text>
                          <Text style={styles.valueCell}>
                            {ins.carga_anual_matafuegos ?? "-"}
                          </Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={styles.labelCell}>
                            Simulacros de evacuación:
                          </Text>
                          <Text style={styles.valueCell}>
                            {ins.simulacros_evacuación ?? "-"}
                          </Text>
                        </View>
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
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Servicio</Text>
                        <Text style={styles.valueCell}>
                          {cond.servicio ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Disponibilidad</Text>
                        <Text style={styles.valueCell}>
                          {cond.disponibilidad ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Cantidad</Text>
                        <Text style={styles.valueCell}>
                          {cond.cantidad ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Estado</Text>
                        <Text style={styles.valueCell}>
                          {cond.estado ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Mantenimiento</Text>
                        <Text style={styles.valueCell}>
                          {cond.mantenimiento ?? "-"}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

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
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Disponibilidad:</Text>
                        <Text style={styles.valueCell}>
                          {cond.disponibilidad ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Potencia:</Text>
                        <Text style={styles.valueCell}>
                          {cond.potencia ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>
                          Estado de la bateria:
                        </Text>
                        <Text style={styles.valueCell}>
                          {cond.estado_bateria ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>
                          Tipo de combustible:
                        </Text>
                        <Text style={styles.valueCell}>
                          {cond.tipo_combustible ?? "-"}
                        </Text>
                      </View>
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
                >
                  <Text style={styles.subSectionTitle}>USO DEL COMEDOR</Text>

                  {c.servicioComedor.map((ea: any, i: number) => (
                    <View key={i} style={{ marginBottom: 8 }}>
                      {/*                       <View style={styles.tableRow}>
                          <Text style={styles.labelCell}>Servicio</Text>
                          <Text style={styles.valueCell}>
                            {ea.servicio ?? "-"}
                          </Text>
                        </View>
  */}
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Disponibilidad</Text>
                        <Text style={styles.valueCell}>
                          {ea.disponibilidad ?? "-"}
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.labelCell}>Locación</Text>
                        <Text style={styles.valueCell}>
                          {ea.tipos_comedor ?? "-"}
                        </Text>
                      </View>
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
          ))}
      </Page>
    </Document>
  );
};
