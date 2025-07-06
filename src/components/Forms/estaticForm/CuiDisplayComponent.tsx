interface CuiDisplayComponentProps {
  cui?: number;
  label?: string;
  sublabel?: string;
}

const CuiDisplayComponent: React.FC<CuiDisplayComponentProps> = ({
  cui,
  label,
  sublabel,
}) => {
  return (
    <div className="mx-10">
      {label && <p className="text-sm">{label}</p>}
      <div className="flex mt-2 p-2 border items-center rounded-2xl shadow-lg bg-white text-black">
        <div className="w-6 h-6 flex justify-center items-center bg-custom rounded-full text-white">
          <p>A</p>
        </div>
        <div className="ml-4">
          <p className="text-sm font-bold">
            CUI (Código Único de Infraestructura):{" "}
            <span className="font-normal">{cui ?? "N/D"}</span>
          </p>
        </div>
      </div>
      {sublabel && (
        <div className="flex p-1 bg-gray-100 border rounded-lg mt-1">
          <p className="text-xs text-gray-400">{sublabel}</p>
        </div>
      )}
    </div>
  );
};

export default CuiDisplayComponent;
