// Spinner.tsx
export default function Spinner2({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  return (
    <div className={`animate-spin rounded-full border-4 border-blue-500 border-t-transparent ${sizes[size]}`} />
  );
}
