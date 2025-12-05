// 🚨 CORRECCIÓN MODULE_NOT_FOUND: Cambiamos las rutas absolutas (@/...) por rutas relativas (../...)
// para que Node.js/ts-node pueda encontrar los módulos fuera del entorno de Next.js.

// Importaciones adaptadas a CommonJS
const { getConnection } = require("../lib/db"); // Corregido
const { recomputeEstadoConstruccion } = require("../lib/recompute-estado"); // Corregido
// La importación de RowDataPacket se elimina ya que el casting es suficiente
// para que TypeScript no se queje si el entorno de ejecución está bien configurado.

// 💡 Este script debe ejecutarse manualmente en el entorno Node.js, no en Next.js.
// El script ahora acepta un parámetro opcional para filtrar por relevamiento_id.

type ConstruccionKey = {
  relevamiento_id: number;
  construccion_id: number;
};

/**
 * Sincroniza de forma masiva los snapshots de estado de construcción.
 * * @param specificRelevamientoId Opcional. Si se proporciona, solo procesa
 * las construcciones asociadas a este ID de relevamiento.
 */
async function syncAllSnapshots(specificRelevamientoId?: number) {
  const filterClause = specificRelevamientoId ? `WHERE ec.relevamiento_id = ${specificRelevamientoId}` : '';
  
  console.log(`Iniciando sincronización masiva de estado_construccion_snapshot. ${specificRelevamientoId ? `(Filtrando por Relevamiento ID: ${specificRelevamientoId})` : '(Procesando TODAS las construcciones)'}`);

  const conn = await getConnection();

  try {
    // 1. Obtener las combinaciones únicas de (relevamiento_id, construccion_id) 
    //    que tienen datos de conservación, aplicando el filtro si existe.
    // 
    // 🚨 CORRECCIÓN TS2344 (previo): Se quita el tipo genérico explícito al no tener RowDataPacket importado.
    // Con `mysql2/promise`, la desestructuración funciona igual para RowDataPacket[].
    const [rows] = await conn.execute(
      `SELECT DISTINCT
          ec.relevamiento_id,
          ec.construccion_id
       FROM estado_conservacion ec
       ${filterClause}
      `
    );

    // Casteamos explícitamente el resultado de filas a nuestro tipo esperado
    // Esto asume que `rows` es el array de resultados de la DB.
    const keysToProcess = rows as ConstruccionKey[];

    if (!Array.isArray(keysToProcess) || keysToProcess.length === 0) {
      console.log("No se encontraron construcciones únicas para procesar o ya están en el snapshot.");
      return;
    }

    console.log(`[INFO] Encontradas ${keysToProcess.length} construcciones para recálculo.`);

    let successCount = 0;
    let failCount = 0;
    const errors: { key: ConstruccionKey; error: string }[] = [];

    // 2. Iterar sobre cada construcción y ejecutar la función de recálculo
    for (const key of keysToProcess) {
      try {
        const result = await recomputeEstadoConstruccion(
          key.relevamiento_id,
          key.construccion_id
        );
        successCount++;
        // console.log(`[OK] Relevamiento ${key.relevamiento_id} - Construcción ${key.construccion_id}: ${result.clasificacion}`);
      } catch (error: any) {
        failCount++;
        errors.push({ 
          key, 
          error: error.message || 'Error desconocido al calcular el score' 
        });
        // console.error(`[FAIL] Error en ${key.relevamiento_id}-${key.construccion_id}: ${error.message}`);
      }
    }

    // 3. Resumen
    console.log("\n=============================================");
    console.log("RESUMEN DE SINCRONIZACIÓN:");
    console.log(`Total de construcciones procesadas: ${keysToProcess.length}`);
    console.log(`✅ Snapshots creados/actualizados: ${successCount}`);
    console.log(`❌ Fallos en el cálculo: ${failCount}`);
    console.log("=============================================");
    
    if (failCount > 0) {
        console.log("\nDETALLES DE FALLOS:");
        errors.forEach(err => {
            console.log(`[ID: ${err.key.relevamiento_id}-${err.key.construccion_id}] Motivo: ${err.error}`);
        });
    }


  } catch (error) {
    console.error("Error fatal en la ejecución del script:", error);
  } finally {
    conn.release(); 
    console.log("Sincronización finalizada. Conexión a DB cerrada.");
  }
}

// -----------------------------------------------------------
// MODIFICACIÓN DE LA EJECUCIÓN: Leer argumentos de línea de comandos
// -----------------------------------------------------------

// Función para obtener el argumento (el primer argumento después del nombre del script)
const getCliArgument = (index: number): string | undefined => {
    // process.argv[0] es 'node', process.argv[1] es el script path
    return process.argv[index + 2]; 
}

const relevamientoIdToFilter = getCliArgument(0);
let filterId: number | undefined;

if (relevamientoIdToFilter) {
    const parsedId = parseInt(relevamientoIdToFilter, 10);
    if (!isNaN(parsedId)) {
        filterId = parsedId;
    } else {
        console.error(`ERROR: El argumento '${relevamientoIdToFilter}' no es un número entero válido.`);
        process.exit(1);
    }
}

// Ejecutar la función principal con el ID filtrado o sin él
syncAllSnapshots(filterId);