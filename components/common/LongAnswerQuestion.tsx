export const LongAnswerQuestion = ({ questionNumber, questionText, lines = 6 }: any) => (
  <div className="mb-6">
    <div className="flex gap-2">
      <span className="font-semibold text-sm">{questionNumber}.</span>
      <div className="flex-grow">
        <p className="text-sm mb-3">{questionText}</p>
      </div>
    </div>
  </div>
);

export const SectionHeader = ({ title, instruction }: any) => (
  <div className="mb-6">
    <h2 className="text-base font-bold mb-2">{title}</h2>
    {instruction && (
      <p className="text-xs italic text-gray-600">{instruction}</p>
    )}
  </div>
);