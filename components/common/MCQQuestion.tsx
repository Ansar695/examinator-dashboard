import { MCQOption } from "./MCQOption";

export const MCQQuestion = ({ questionNumber, questionText, options }: any) => (
  <div className="mb-6">
    <div className="flex gap-2 mb-2">
      <span className="font-semibold text-sm">{questionNumber}.</span>
      <p className="text-sm flex-grow">{questionText}</p>
    </div>
    <div className="flex gap-3 ml-6">
      {options.map((option: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="text-xs font-semibold">({option.letter})</span>
          <MCQOption letter={option.letter} />
        </div>
      ))}
    </div>
  </div>
);