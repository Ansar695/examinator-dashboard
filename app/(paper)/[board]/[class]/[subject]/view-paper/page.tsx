'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { PageTransition } from '@/components/shared/Transition'
import PaperWorkspace from '@/components/teacher/PaperWorkspace'

export default function ViewPaper() {
  const params = useParams()
  const searchParams = useSearchParams()
  const board = params.board as string
  const classNumber = params.class as string
  const subject = params.subject as string
  const paperId = searchParams.get('paperId')
  const subjectId = searchParams.get('subjectId')
  const embedded = searchParams.get('embed') === '1'

  return (
    <PageTransition>
      <PaperWorkspace
        board={board}
        classNumber={classNumber}
        subject={subject}
        paperId={paperId}
        subjectId={subjectId}
        embedded={embedded}
      />
    </PageTransition>
  )
}
