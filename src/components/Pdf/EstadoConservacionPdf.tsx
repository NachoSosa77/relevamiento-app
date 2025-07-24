/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet, Text, View } from "@react-pdf/renderer";

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
export default function EstadoConservacionDetailComponent({ c }: { c: any[] }) {
  const estadoConservacion = c?.map((item: any) => ({
    ...item,
    subtipo: item.sub_tipo,
  }));

  const tiposUnicos = Array.from(
    new Set(
      estadoConservacion
        ?.map((item) => item.tipo)
        .filter((tipo): tipo is string => tipo != null)
    )
  );

  return (
    <>
      {estadoConservacion?.length > 0 && (
        <View style={styles.containerBox} break>
          <Text style={styles.subSectionTitle}>
            CARACTERÍSTICAS CONSTRUCTIVAS Y ESTADO DE CONSERVACIÓN
          </Text>

          {tiposUnicos.map((tipo) => {
            const itemsDelTipo = estadoConservacion.filter(
              (item) => item.tipo === tipo
            );

            // Títulos más legibles
            let tituloTipo = tipo.toUpperCase();
            if (tipo === "estructura_resistente")
              tituloTipo = "ESTRUCTURA Y RESISTENTE";
            if (tipo === "paredes_cerramientos")
              tituloTipo = "PAREDES Y CERRAMIENTOS";
            if (tipo === "techo") tituloTipo = "TECHO";

            return (
              <View key={tipo} style={{ marginTop: 8 }}>
                <Text style={styles.subSectionTitle}>{tituloTipo}</Text>

                {itemsDelTipo.map((item, idx) => (
  <View key={idx} style={{ marginBottom: 6 }}>
    <View style={styles.tableRow}>
      <Text style={styles.labelCell}>
        {tipo === "estructura_resistente"
          ? "Tipo de estructura"
          : item.subtipo
          ? item.subtipo.charAt(0).toUpperCase() + item.subtipo.slice(1)
          : "Subtipo"}
      </Text>
      <Text style={styles.valueCell}>{"—"}</Text>
    </View>

    <View style={styles.tableRow}>
      <Text style={styles.labelCell}>{item.estructura ?? "—"}</Text>
      <Text style={styles.valueCell}>{item.estado ?? "—"}</Text>
    </View>
  </View>
))}
              </View>
            );
          })}
        </View>
      )}
    </>
  );
}
