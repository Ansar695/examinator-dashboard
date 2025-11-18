export const MCQOption = ({ letter }: any) => (
  <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs font-bold hover:bg-blue-50 cursor-pointer transition-colors">
    {letter}
  </div>
);