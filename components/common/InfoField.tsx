export const InfoField = ({ label, className }: any) => (
  <div className={`w-full h-9 flex items-center gap-2 relative border border-gray-500 rounded-sm p-2 ${className}`}>
    <div className="absolute top-[-30%] left-1 bg-white px-2 font-semibold text-xs">{label}</div>
  </div>
);