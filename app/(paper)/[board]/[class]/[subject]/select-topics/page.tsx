/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/shared/Transition";
import { useGetChaptersBySubjectQuery } from "@/lib/api/educationApi";
import { ChapterMultiSelect } from "@/components/subjects/ChaptersMultiSelect";

export default function SelectTopics() {
  const [topicKeys, setTopicKeys] = useState<string[]>([]);
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTopics = JSON.parse(localStorage.getItem("selectedTopics") || "[]");
  const selectedChapters = JSON.parse(localStorage.getItem("selectedChapters") || "[]");

  const board = params.board as any;
  const classNumber = params.class as string;
  const subject = params.subject as string;
  const subjectId = searchParams.get("subjectId");

  const { data: chapters, isLoading: chaptersLoading } =
    useGetChaptersBySubjectQuery(
      { subjectId: subjectId || "" },
      {
        skip: !subjectId,
      }
    );

  const handleSubmit = () => {
    if (topicKeys.length === 0) return;

    const chapterIdSet = new Set<string>();
    const selectedTopicTitles: Record<string, string[]> = {};
    (chapters || []).forEach((ch) => {
      const subTopics = ch.subTopics || [];
      const selectedForChapter = subTopics.filter((t) =>
        topicKeys.includes(`${ch.id}::${t}`)
      );
      if (selectedForChapter.length) {
        chapterIdSet.add(ch.id);
        selectedTopicTitles[ch.id] = selectedForChapter;
      }
    });

    localStorage.setItem("selectedTopics", JSON.stringify(topicKeys));
    localStorage.setItem("selectedSubTopicsByChapter", JSON.stringify(selectedTopicTitles));
    localStorage.setItem("selectedChapters", JSON.stringify([...chapterIdSet]));
    router.push(
      `/${board}/${classNumber}/${subject}/select-questions${subjectId ? `?subjectId=${subjectId}` : ''}`
    );
  };

  useEffect(() => {
    if (selectedTopics.length) {
      setTopicKeys(selectedTopics);
      return;
    }

    if (selectedChapters.length && (chapters || []).length) {
      const topicKeysFromChapters = (chapters || []).flatMap((ch) =>
        selectedChapters.includes(ch.id)
          ? (ch.subTopics || []).map((t) => `${ch.id}::${t}`)
          : []
      );
      if (topicKeysFromChapters.length) {
        setTopicKeys(topicKeysFromChapters);
      }
    }
  }, [selectedTopics.length, selectedChapters.length, chapters])
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link href={`/${board}/${classNumber}/select-subjects`}>
              <Button
                variant="ghost"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Subject Selection
              </Button>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Select Topics for Your Paper
            </h1>
            <p className="text-xl text-gray-600 capitalize">
              {board.replace("-", " ")} - Class {classNumber} - {subject}
            </p>
          </motion.div>

          <ChapterMultiSelect
            chapters={chapters || []}
            loading={chaptersLoading}
            values={topicKeys}
            onChange={setTopicKeys}
            onSubmit={() => handleSubmit()}
          />
        </div>
      </div>
    </PageTransition>
  );
}
