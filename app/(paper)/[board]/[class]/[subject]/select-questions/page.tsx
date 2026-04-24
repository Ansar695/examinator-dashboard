"use client";

import { useParams, useSearchParams } from "next/navigation";
import { PageTransition } from "@/components/shared/Transition";
import QuestionSelectionPanel from "@/components/questions/QuestionSelectionPanel";

export default function SelectQuestions() {
  const params = useParams();
  const searchParams = useSearchParams();
  const board = params.board as string;
  const classNumber = params.class as string;
  const subject = params.subject as string;
  const subjectId = searchParams.get("subjectId");
  const paperId = searchParams.get("paperId");

  return (
    <PageTransition>
      <div className="min-h-screen">
        <QuestionSelectionPanel
          board={board}
          classNumber={classNumber}
          subject={subject}
          subjectId={subjectId}
          paperId={paperId}
          showHeader
        />
      </div>
    </PageTransition>
  );
}
