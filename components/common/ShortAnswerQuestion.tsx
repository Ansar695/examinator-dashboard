export const ShortAnswerQuestion = ({ questionNumber, questionText }: any) => (
  <div className="mb-4">
    <div className="flex gap-2">
      <span className="font-semibold text-sm">{questionNumber}.</span>
      <div className="flex-grow">
        <p className="text-sm mb-2">{questionText}</p>
        <div className="border-b border-gray-300 h-12"></div>
      </div>
    </div>
  </div>
);