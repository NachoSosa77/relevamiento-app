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

export const ConstruccionLocalesPdf = ({ data }: { data: any }) => {
 
  const { relevamiento, construcciones } = data;

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

              {/* Locales */}
              {c.locales?.length > 0 && (
                <View>
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

                        <View style={styles.tableRow}>
                          <Text style={styles.tableHeaderCell}>Largo predominante</Text>
                          <Text style={styles.tableCell}>
                            {l.largo_predominante ? `${l.largo_predominante} m²` : "N/A"}
                          </Text>
                        </View>

                        <View style={styles.tableRow}>
                          <Text style={styles.tableHeaderCell}>Ancho predominante</Text>
                          <Text style={styles.tableCell}>
                            {l.ancho_predominante ? `${l.ancho_predominante} m²` : "N/A"}
                          </Text>
                        </View>

                        <View style={styles.tableRow}>
                          <Text style={styles.tableHeaderCell}>Diámetro</Text>
                          <Text style={styles.tableCell}>
                            {l.diametro ? `${l.diametro} m²` : "N/A"}
                          </Text>
                        </View>

                        <View style={styles.tableRow}>
                          <Text style={styles.tableHeaderCell}>Altura máxima</Text>
                          <Text style={styles.tableCell}>
                            {l.altura_maxima ? `${l.altura_maxima} m²` : "N/A"}
                          </Text>
                        </View>

                        <View style={styles.tableRow}>
                          <Text style={styles.tableHeaderCell}>Altura mínima</Text>
                          <Text style={styles.tableCell}>
                            {l.altura_minima ? `${l.altura_minima} m²` : "N/A"}
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
                          <Text
                            style={[
                              styles.tableCell,
                              { flex: 3, fontSize: 10 },
                            ]}
                          >
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
                                : "-"}
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
                        (item, idx) => (
                          <Text key={idx}>
                            {typeof item === "object"
                              ? item?.equipo ?? "-"
                              : item ?? "-"}
                          </Text>
                        )
                      )}

                      {(l.tipo === "Sanitarios Alumnos" ||
                        l.tipo === "Sanitarios docentes/personal" ||
                        l.tipo === "Aula especial") &&
                        renderLocalArray(
                          "Equipamiento Sanitario",
                          l.equipamientoSanitario,
                          (item, idx) => (
                            <Text key={idx}>
                              {typeof item === "object"
                                ? item?.equipo ?? "-"
                                : item ?? "-"}
                            </Text>
                          )
                        )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
      </Page>
    </Document>
  );
};
