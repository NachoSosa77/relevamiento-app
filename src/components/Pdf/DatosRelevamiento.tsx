// pdf/components/DatosRelevamiento.tsx
import { getRelevamientoByIdServer } from "@/app/lib/server/relevamientoDb";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    borderBottom: "1px solid #E0E0E0",
    marginBottom: 12,
  },
  title: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  row: {
    fontSize: 11,
    marginBottom: 3,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    color: "#000",
  },
});

const DatosRelevamiento = async ({ relevamientoId }: { relevamientoId: number}) => {
  const data = await getRelevamientoByIdServer(relevamientoId);

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Datos del relevamiento</Text>
        <Text style={styles.row}>No se encontraron datos para ID {relevamientoId}</Text>
      </View>
    );
  }

  const fecha = new Date(data.created_at).toLocaleDateString("es-AR");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos del relevamiento</Text>
      <Text style={styles.row}>
        <Text style={styles.label}>ID: </Text>
        <Text style={styles.value}>{data.id}</Text>
      </Text>
      <Text style={styles.row}>
        <Text style={styles.label}>Fecha de creación: </Text>
        <Text style={styles.value}>{fecha}</Text>
      </Text>
      <Text style={styles.row}>
        <Text style={styles.label}>Estado: </Text>
        <Text style={styles.value}>{data.estado}</Text>
      </Text>
      {data.created_by && (
        <Text style={styles.row}>
          <Text style={styles.label}>Responsable: </Text>
          <Text style={styles.value}>{data.created_by}</Text>
        </Text>
      )}
      {data.email && (
        <Text style={styles.row}>
          <Text style={styles.label}>Email: </Text>
          <Text style={styles.value}>{data.email}</Text>
        </Text>
      )}
    </View>
  );
};

export default DatosRelevamiento;
