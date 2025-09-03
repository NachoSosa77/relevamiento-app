export default function DimensionesSkeleton() {
  return (
    <div className="mx-10 text-sm animate-pulse">
      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-custom text-white">
            {["#", "DIMENSIONES", "Largo", "Ancho", "Diámetro", "Altura max", "Altura min", "Acción"].map((title, i) => (
              <th key={i} className="border p-2 bg-gray-300 text-gray-400 h-6"></th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border">
            {Array(8).fill(0).map((_, i) => (
              <td key={i} className="border p-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <div className="h-8 w-32 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
