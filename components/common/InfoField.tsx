export const InfoField = ({ label, className }: any) => (
  <div className={`relative h-9 w-full border border-gray-500 rounded-sm px-2 pt-3 pb-2 print:border-black ${className}`}>
    <span className="absolute -top-2 left-2 bg-white px-1 text-xs font-semibold print:bg-white print:text-black">
      {label}
    </span>
  </div>
);
