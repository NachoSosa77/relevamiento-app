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

export const ArchivosDelRelevamiento = ({ data }: { data: any }) => {
  const { relevamiento, archivos } = data;

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

        {/* Archivos: Planos primero */}
        {archivos?.some((a: any) =>
          a.tipo_archivo?.toLowerCase().includes("pdf")
        ) && (
          <View style={styles.section}>
            <Text style={styles.title}>Planos</Text>
            {archivos
              .filter((a: any) => a.tipo_archivo?.toLowerCase().includes("pdf"))
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
