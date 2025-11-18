import { ExamHeader } from "../common/ExamHeader";
import { LongAnswerQuestion, SectionHeader } from "../common/LongAnswerQuestion";
import { MCQQuestion } from "../common/MCQQuestion";
import { ShortAnswerQuestion } from "../common/ShortAnswerQuestion";

const Template1 = () => {
  const examDetails = {
    studentName: 'Biology',
    rollNum: '',
    subjectName: '',
    timeAllowed: '45',
    examSyllabus: "CHAP 5",
    totalMarks: '40',
    examDate: '08-Sep-2025',
    className: 'INTER-I',
    paperCode: '#102'
  };

  const mcqQuestions = [
    {
      id: 1,
      text: "What roles does nicotinamide adenine dinucleotide play in oxidative pathways?",
      options: [
        { letter: 'A', text: 'Enzyme' },
        { letter: 'B', text: 'Coenzyme' },
        { letter: 'C', text: 'Prosthetic group' },
        { letter: 'D', text: 'Inhibitor' }
      ]
    },
    {
      id: 2,
      text: "Which of the following enzymes are found dissolved in cytoplasm?",
      options: [
        { letter: 'A', text: 'Enzymes of Calvin cycle' },
        { letter: 'B', text: 'Enzymes of protein synthesis' },
        { letter: 'C', text: 'Enzymes of glycolysis' },
        { letter: 'D', text: 'Enzymes of Krebs cycle' }
      ]
    },
    {
      id: 3,
      text: "What is the active site of an enzyme?",
      options: [
        { letter: 'A', text: 'The region where energy is stored' },
        { letter: 'B', text: 'The location at which catalysis occurs' },
        { letter: 'C', text: 'The place where enzymes are stored' },
        { letter: 'D', text: 'The outer surface of the substrate' }
      ]
    },
    {
      id: 4,
      text: "How is the active site positioned on the enzyme?",
      options: [
        { letter: 'A', text: "Hidden inside the enzyme's core" },
        { letter: 'B', text: 'Located on the tail of the enzyme' },
        { letter: 'C', text: 'A large open cavity' },
        { letter: 'D', text: 'A small cleft or depression on the surface of globular enzyme molecule' }
      ]
    },
    {
      id: 5,
      text: "Enzyme B requires Zn²⁺ to catalyse the conversion of substrate X. The zinc is best identified as a(n):",
      options: [
        { letter: 'A', text: 'Coenzyme' },
        { letter: 'B', text: 'Activator' },
        { letter: 'C', text: 'Substrate' },
        { letter: 'D', text: 'Product' }
      ]
    },
    {
      id: 6,
      text: "What are enzymes primarily composed of?",
      options: [
        { letter: 'A', text: 'DNA chains' },
        { letter: 'B', text: 'Polysaccharide units' },
        { letter: 'C', text: 'Polypeptide chains that are coiled upon themselves' },
        { letter: 'D', text: 'Nucleotide bases' }
      ]
    },
    {
      id: 7,
      text: "Why do different types of cells have different sets of enzymes?",
      options: [
        { letter: 'A', text: 'Because they all perform the same chemical reactions' },
        { letter: 'B', text: 'Because red blood cells and nerve cells have different chemical reactions' },
        { letter: 'C', text: 'Because enzymes are not important in cells' },
        { letter: 'D', text: 'Because all cells have identical functions' }
      ]
    },
    {
      id: 8,
      text: "What determines the specificity of an enzyme?",
      options: [
        { letter: 'A', text: 'The size of the enzyme' },
        { letter: 'B', text: "The shape of the enzyme's binding" },
        { letter: 'C', text: 'The temperature of the environment' },
        { letter: 'D', text: 'The color of the enzyme' }
      ]
    },
    {
      id: 9,
      text: "What happens when a substrate binds to an enzyme?",
      options: [
        { letter: 'A', text: 'The enzyme is permanently altered' },
        { letter: 'B', text: 'The enzyme-substrate (ES) complex is immediately catalytic site is activated' },
        { letter: 'C', text: 'The substrate is destroyed immediately' },
        { letter: 'D', text: 'The enzyme loses its specificity' }
      ]
    },
    {
      id: 10,
      text: "How do enzymes lower the activation energy during a reaction",
      options: [
        { letter: 'A', text: 'By breaking all bonds in substrate' },
        { letter: 'B', text: 'By stressing and destabilizing particular bonds of substrate' },
        { letter: 'C', text: 'By increasing the temperature of the reaction' },
        { letter: 'D', text: 'By changing the substrate into an inhibitor' }
      ]
    },
    {
      id: 11,
      text: "What happens to the enzyme after the substrate is transformed into products?",
      options: [
        { letter: 'A', text: 'It is permanently altered' },
        { letter: 'B', text: 'It detaches from the products' },
        { letter: 'C', text: 'It becomes part of the product' },
        { letter: 'D', text: 'It is consumed in the reaction' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto bg-white">
        {/* Header Section */}
        <ExamHeader
          institutionName="THE AMBITIOUS ONLINE ACADEMY"
          examDetails={examDetails}
        />

        <hr className="border-t-2 border-gray-800 my-6" />

        {/* MCQ Section */}
        <div className="mb-8">
          <SectionHeader 
            title="Multiple Choice Questions"
            instruction="Choose the correct option and mark it on the answer sheet"
          />
          <div className="space-y-4">
            {mcqQuestions.map((q) => (
              <MCQQuestion
                key={q.id}
                questionNumber={q.id}
                questionText={q.text}
                options={q.options}
              />
            ))}
          </div>
        </div>

        {/* Page break for print */}
        <div className="print:break-before-page"></div>

        {/* Short Questions Section */}
        <div className="mb-8">
          <SectionHeader
            title="II. SHORT QUESTIONS"
            instruction="Answer any 5 questions. Each question carries equal marks."
          />
          <ShortAnswerQuestion 
            questionNumber={1}
            questionText="Define enzyme and explain its importance in biological systems."
          />
          <ShortAnswerQuestion 
            questionNumber={2}
            questionText="What is the lock and key model of enzyme action?"
          />
          <ShortAnswerQuestion 
            questionNumber={3}
            questionText="Differentiate between competitive and non-competitive inhibition."
          />
          <ShortAnswerQuestion 
            questionNumber={4}
            questionText="Explain how temperature affects enzyme activity."
          />
          <ShortAnswerQuestion 
            questionNumber={5}
            questionText="What are cofactors? Give two examples."
          />
        </div>

        {/* Long Questions Section */}
        <div className="mb-8">
          <SectionHeader 
            title="III. LONG QUESTIONS"
            instruction="Answer any 2 questions. Each question carries 10 marks."
          />
          <LongAnswerQuestion
            questionNumber={1}
            questionText="Describe in detail the mechanism of enzyme action. Include the induced fit model and the role of active sites."
            lines={8}
          />
          <LongAnswerQuestion 
            questionNumber={2}
            questionText="Discuss the factors that affect enzyme activity. How do pH, temperature, and substrate concentration influence enzymatic reactions?"
            lines={8}
          />
          <LongAnswerQuestion 
            questionNumber={3}
            questionText="Explain the concept of enzyme specificity. What structural features of enzymes contribute to their specificity?"
            lines={8}
          />
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:break-before-page {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
};

export default Template1;