interface SeparadorData {
  label: string;
  value: string;
}

interface SeparadorReutilizableProps {
  data: SeparadorData;
}

export default function SeparadorReutilizable({
  data,
}: SeparadorReutilizableProps) {
  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
      <div className="flex mt-2 border rounded-2xl items-center justify-center bg-custom text-white">
        <div className="flex p-2 justify-center items-center text-white text-sm font-bold">
          <p>{data.label}</p>
        </div>
      </div>
      <div className="flex flex-col p-2 justify-center items-cente text-sm">
        <p>{data.value}</p>
      </div>
    </div>
  );
}
