/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Image,
  Page,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";
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
    borderRightWidth: 0,
    borderBottomWidth: 0,
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
    marginLeft: 10,
    marginBottom: 4,
  },
  localSubItem: {
    marginBottom: 2,
  },
});

export const PdfRelevamientoResumen = ({ data }: { data: any }) => {
  const {
    relevamiento,
    respondientes,
    visitas,
    espacioEscolar,
    instituciones,
    areasExteriores,
  } = data;

  return (
    <>
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

        {/* instituciones */}
        {instituciones?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Instituciones</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeaderCell}>Institución</Text>
                <Text style={styles.tableHeaderCell}>Cue</Text>
                <Text style={styles.tableHeaderCell}>Modalidad/Nivel</Text>
                <Text style={styles.tableHeaderCell}>Localidad</Text>
              </View>
              {instituciones.map((v: any) => (
                <View key={v.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{v.institucion}</Text>
                  <Text style={styles.tableCell}>{v.cue}</Text>
                  <Text style={styles.tableCell}>{v.modalidad_nivel}</Text>
                  <Text style={styles.tableCell}>{v.localidad}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

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

        {/* Construcciones */}
        {espacioEscolar?.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.title}>Predio</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeaderCell}>
                  Cantidad de construcciones
                </Text>
                <Text style={styles.tableHeaderCell}>
                  Superficie total del predio
                </Text>
                <Text style={styles.tableHeaderCell}>Cui</Text>
                <Text style={styles.tableHeaderCell}>Observaciones</Text>
              </View>
              {espacioEscolar.map((r: any) => (
                <View key={r.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {r.cantidad_construcciones}
                  </Text>
                  <Text style={styles.tableCell}>
                    {r.superficie_total_predio}
                  </Text>
                  <Text style={styles.tableCell}>{r.cui}</Text>
                  <Text style={styles.tableCell}>{r.observaciones}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Areas Exteriores */}
        {areasExteriores?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Áreas Exteriores</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeaderCell}>Id Plano</Text>
                <Text style={styles.tableHeaderCell}>Tipo</Text>
                <Text style={styles.tableHeaderCell}>Superficie</Text>
                <Text style={styles.tableHeaderCell}>Terminación Piso</Text>
                <Text style={styles.tableHeaderCell}>Estado</Text>
              </View>
              {areasExteriores.map((r: any) => (
                <View key={r.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{r.identificacion_plano}</Text>
                  <Text style={styles.tableCell}>{r.tipo}</Text>
                  <Text style={styles.tableCell}>{r.superficie}</Text>
                  <Text style={styles.tableCell}>{r.terminacion_piso}</Text>
                  <Text style={styles.tableCell}>{r.estado_conservacion}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </>
  );
};
