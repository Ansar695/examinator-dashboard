import { Question } from "@/components/chapters/questions-generation-modal";

export const payloadFormat = (questions: Question[], qType: string, chapterId: string) => {
    let payload: any = []
    if(qType === "mcqs") {
      payload  = questions?.map((q: any) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.answer_index,
        difficulty: (q.difficulty || "medium").toUpperCase(), // Convert to uppercase to match Prisma enum
        chapterId,
        isActive: q.isActive ?? true,
      }));
    }
    if(qType === "short") {
      payload = questions?.map((q: any) => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        difficulty: (q.difficulty || "medium").toUpperCase(),
        chapterId,
        isActive: q.isActive ?? true,
      }));
    }
    if(qType === "long") {
      payload = questions?.map((q: any) => ({
        id: q.id,
        questionType: q?.questionType || "DEFAULT",
        question: q.question,
        answer: q.answer,
        difficulty: (q.difficulty || "medium").toUpperCase(),
        chapterId,
        isActive: q.isActive ?? true,
      }));
    }
    return payload
  }