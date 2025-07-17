/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { JSX } from "react";
const logoUrl = "/img/logo-ministerio.png";

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
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 6,
  },
  fila: {
    flexDirection: "row",
  },
  celda: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    fontSize: 10,
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
    fontSize: 14,
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
    borderBottom: "1pt solid #E2E8F0",
  },
  tableHeaderCell: {
    flex: 1,
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
    marginLeft: 10,
    marginBottom: 4,
  },
  localSubItem: {
    marginBottom: 2,
  },
});

export const PdfRelevamientoResumen = ({ data }: { data: any }) => {
  const { relevamiento, respondientes, visitas, construcciones, archivos } =
    data;

  // Helper to render arrays of items for locals, e.g. aberturas, acondicionamiento, etc.
  const renderLocalArray = (
    title: string,
    items: any[],
    renderItem: (item: any, idx: number) => JSX.Element,
    isTable = false,
    tableHeaders: string[] = []
  ) => {
    if (!items || items.length === 0) return null;
    return (
      <View style={styles.localSubListContainer}>
        <Text style={styles.subSectionTitle}>{title}</Text>
        {isTable ? (
          <View style={styles.tabla}>
            {tableHeaders.length > 0 && (
              <View style={styles.fila}>
                {tableHeaders.map((header, idx) => (
                  <Text key={idx} style={[styles.celda, styles.encabezado]}>
                    {header}
                  </Text>
                ))}
              </View>
            )}
            {items.map((item, idx) => renderItem(item, idx))}
          </View>
        ) : (
          items.map((item, idx) => (
            <View key={idx} style={styles.localSubItem}>
              {renderItem(item, idx)}
            </View>
          ))
        )}
      </View>
    );
  };

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

        {/* Visitas */}
        {visitas?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Visitas Realizadas</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeaderCell}>N°</Text>
                <Text style={styles.tableHeaderCell}>Fecha</Text>
                <Text style={styles.tableHeaderCell}>Inicio</Text>
                <Text style={styles.tableHeaderCell}>Finalización</Text>
              </View>
              {visitas.map((v: any) => (
                <View key={v.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{v.numero_visita}</Text>
                  <Text style={styles.tableCell}>{v.fecha}</Text>
                  <Text style={styles.tableCell}>{v.hora_inicio}</Text>
                  <Text style={styles.tableCell}>{v.hora_finalizacion}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Respondientes */}
        {respondientes?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Respondientes</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeaderCell}>Nombre</Text>
                <Text style={styles.tableHeaderCell}>Cargo</Text>
                <Text style={styles.tableHeaderCell}>Establecimiento</Text>
                <Text style={styles.tableHeaderCell}>Teléfono</Text>
              </View>
              {respondientes.map((r: any) => (
                <View key={r.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{r.nombre_completo}</Text>
                  <Text style={styles.tableCell}>{r.cargo}</Text>
                  <Text style={styles.tableCell}>{r.establecimiento}</Text>
                  <Text style={styles.tableCell}>{r.telefono}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Construcciones y Locales con detalle */}
        {construcciones?.length > 0 &&
          construcciones.map((c: any) => (
            <View key={c.id} style={styles.section}>
              <Text style={styles.title}>
                Construcción N° {c.numero_construccion}
              </Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeaderCell}>Destino:</Text>
                  <Text style={styles.tableHeaderCell}>Antigüedad:</Text>
                  <Text style={styles.tableHeaderCell}>Superficie Total:</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{c.destino}</Text>
                  <Text style={styles.tableCell}>{c.antiguedad}</Text>
                  <Text style={styles.tableCell}>{c.superficie_total} m²</Text>
                </View>
              </View>

              {/* Condiciones de accesibilidad */}
              {c.condicionesAccesibilidad?.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.subSectionTitle}>
                    Condiciones de Accesibilidad
                  </Text>

                  {/* Encabezado de tabla */}
                  <View style={styles.tableRow}>
                    <Text style={styles.tableHeaderCell}>Servicio</Text>
                    <Text style={styles.tableHeaderCell}>Disponibilidad</Text>
                    <Text style={styles.tableHeaderCell}>Cantidad</Text>
                    <Text style={styles.tableHeaderCell}>Estado</Text>
                    <Text style={styles.tableHeaderCell}>Mantenimiento</Text>
                  </View>

                  {/* Filas de datos */}
                  {c.condicionesAccesibilidad.map((cond: any, i: number) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={styles.tableCell}>
                        {cond.servicio ?? "-"}
                      </Text>
                      <Text style={styles.tableCell}>
                        {cond.disponibilidad ?? "-"}
                      </Text>
                      <Text style={styles.tableCell}>
                        {cond.cantidad ?? "-"}
                      </Text>
                      <Text style={styles.tableCell}>{cond.estado ?? "-"}</Text>
                      <Text style={styles.tableCell}>
                        {cond.mantenimiento ?? "-"}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Energías alternativas */}
              {c.energiasAlternativas?.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.subSectionTitle}>
                    Energías Alternativas
                  </Text>
                  {c.energiasAlternativas.map((ea: any, i: number) => (
                    <View key={i} style={styles.localSubItem}>
                      <Text>{ea.disponibilidad}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Instalaciones seguridad incendio */}
              {c.instalacionesSeguridadIncendio?.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.subSectionTitle}>
                    Instalaciones Seguridad Incendio
                  </Text>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableHeaderCell}>Servicio</Text>
                    <Text style={styles.tableHeaderCell}>Disponibilidad</Text>
                    <Text style={styles.tableHeaderCell}>Cantidad</Text>
                    <Text style={styles.tableHeaderCell}>Estado</Text>
                    <Text style={styles.tableHeaderCell}>Mantenimiento</Text>
                  </View>

                  {c.instalacionesSeguridadIncendio.map(
                    (ins: any, i: number) => (
                      <View key={i} style={styles.tableRow}>
                        <Text style={styles.tableCell}>
                          {ins.servicio ?? "-"}
                        </Text>
                        <Text style={styles.tableCell}>
                          {ins.disponibilidad ?? "-"}
                        </Text>
                        <Text style={styles.tableCell}>
                          {ins.cantidad ?? "-"}
                        </Text>
                        <Text style={styles.tableCell}>
                          {ins.carga_anual_matafuegos ?? "-"}
                        </Text>
                        <Text style={styles.tableCell}>
                          {ins.simulacros_evacuación ?? "-"}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}

              {/* Locales */}
              {c.locales?.length > 0 && (
                <>
                  <Text style={[styles.subSectionTitle, { marginTop: 12 }]}>
                    Locales
                  </Text>
                  {c.locales.map((l: any) => (
                    <View key={l.id} style={styles.localContainer}>
                      <Text style={styles.localHeader}>
                        • {l.identificacion_plano} - {l.tipo}
                      </Text>

                      <View style={styles.tableContainer}>
                        {/* Fila: Superficie */}
                        <View style={styles.tableRow}>
                          <Text style={styles.tableHeaderCell}>Superficie</Text>
                          <Text style={styles.tableCell}>
                            {l.superficie ? `${l.superficie} m²` : "N/A"}
                          </Text>
                        </View>

                        {/* Fila: Protección contra robo */}
                        <View style={styles.tableRow}>
                          <Text style={styles.tableHeaderCell}>
                            Protección contra robo
                          </Text>
                          <Text style={styles.tableCell}>
                            {l.proteccion_contra_robo ?? "N/A"}
                          </Text>
                        </View>

                        {/* Fila: Observaciones */}
                        <View style={styles.tableRow}>
                          <Text style={styles.tableHeaderCell}>
                            Observaciones
                          </Text>
                          <Text style={[styles.tableCell, { flex: 3 }]}>
                            {l.observaciones?.trim() ? l.observaciones : "-"}
                          </Text>
                        </View>
                      </View>

                      {/* Render arrays con helper */}

                      {renderLocalArray(
                        "Materiales Predominantes",
                        l.materialesPredominantes,
                        (item, idx) => (
                          <View style={styles.fila} key={idx}>
                            <Text style={styles.celda}>{item.item ?? "-"}</Text>
                            <Text style={styles.celda}>
                              {item.material ?? "-"}
                            </Text>
                            <Text style={styles.celda}>
                              {item.estado ?? "-"}
                            </Text>
                          </View>
                        ),
                        true, // le pasamos un flag para saber si es tabla
                        ["Item", "Material", "Estado"]
                      )}

                      {renderLocalArray(
                        "Aberturas",
                        l.aberturas,
                        (item, idx) => (
                          <View style={styles.fila} key={idx}>
                            <Text style={styles.celda}>{item.abertura}</Text>
                            <Text style={styles.celda}>{item.tipo}</Text>
                            <Text style={styles.celda}>{item.cantidad}</Text>
                            <Text style={styles.celda}>{item.estado}</Text>
                          </View>
                        ),
                        true,
                        ["Item", "Tipo", "Material", "Estado"]
                      )}

                      {renderLocalArray(
                        "Iluminación y Ventilación",
                        l.iluminacionVentilacion,
                        (item, idx) => (
                          <View style={styles.fila} key={idx}>
                            <Text style={styles.celda}>
                              {item.condicion ?? "-"}
                            </Text>
                            <Text style={styles.celda}>
                              {item.disponibilidad ?? "-"}
                            </Text>
                            <Text style={styles.celda}>
                              {item.superficie_iluminacion
                                ? `${item.superficie_iluminacion} m²`
                                : "-"}{" "}
                            </Text>
                            <Text style={styles.celda}>
                              {item.superficie_ventilacion
                                ? `${item.superficie_ventilacion} m²`
                                : "-"}
                            </Text>
                          </View>
                        ),
                        true,
                        [
                          "Condición",
                          "Disponibilidad",
                          "Superficie de iluminación",
                          "Superficie de ventilación",
                        ]
                      )}

                      {renderLocalArray(
                        "Acondicionamiento Térmico",
                        l.acondicionamientoTermico,
                        (item, idx) => (
                          <View style={styles.fila} key={idx}>
                            <Text style={styles.celda}>{item.tipo ?? "-"}</Text>
                            <Text style={styles.celda}>
                              {item.cantidad ?? "-"}
                            </Text>
                            <Text style={styles.celda}>
                              {item.disponibilidad ?? "-"}
                            </Text>
                          </View>
                        ),
                        true,
                        ["Tipo", "Cantidad", "Disponibilidad"]
                      )}

                      {renderLocalArray(
                        "Servicios Básicos",
                        l.instalacionesBasicas,
                        (item, idx) => (
                          <View style={styles.fila} key={idx}>
                            <Text style={styles.celda}>
                              {item.servicio ?? "-"}
                            </Text>
                            <Text style={styles.celda}>
                              {item.tipo_instalacion ?? "-"}
                            </Text>
                            <Text style={styles.celda}>
                              {item.funciona ?? "-"}
                            </Text>
                            <Text style={styles.celda}>
                              {item.motivo ?? "-"}
                            </Text>
                          </View>
                        ),
                        true,
                        [
                          "Servicio",
                          "Tipo instalación",
                          "Funcionamiento",
                          "Motivo",
                        ]
                      )}

                      {renderLocalArray(
                        "Equipamiento Cocina/Offices",
                        l.equipamientoCocina,
                        (item) => (
                          <Text>{item.equipo ?? item}</Text>
                        )
                      )}

                      {(l.tipo === "Sanitarios Alumnos" ||
                        l.tipo === "Sanitarios docentes/personal" ||
                        l.tipo === "Aula especial") &&
                        renderLocalArray(
                          "Equipamiento Sanitario",
                          l.equipamientoSanitario,
                          (item) => <Text>{item.equipo ?? item}</Text>
                        )}
                    </View>
                  ))}
                </>
              )}
            </View>
          ))}

        {/* Archivos: Planos primero */}
        {archivos?.some((a: any) =>
          a.tipo_archivo?.toLowerCase().includes("plano")
        ) && (
          <View style={styles.section}>
            <Text style={styles.title}>Planos</Text>
            {archivos
              .filter((a: any) =>
                a.tipo_archivo?.toLowerCase().includes("plano")
              )
              .map((plano: any) => (
                <View key={plano.id} style={styles.row}>
                  <Text style={styles.label}>Plano:</Text>
                  <Link src={plano.archivo_url} style={styles.value}>
                    {plano.archivo_url}
                  </Link>
                </View>
              ))}
          </View>
        )}

        {/* Archivos: Imágenes en 2 columnas */}
        {archivos?.some((a: any) => a.tipo_archivo?.includes("imagen")) && (
          <View style={styles.section}>
            <Text style={styles.title}>Imágenes Adjuntas</Text>
            <View style={styles.imageGrid}>
              {archivos
                .filter((a: any) => a.tipo_archivo?.includes("imagen"))
                .map((img: any) => (
                  <View key={img.id} style={styles.imageContainer}>
                    <Image src={img.archivo_url} style={styles.image} />
                    <Text>{img.tipo_archivo}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
