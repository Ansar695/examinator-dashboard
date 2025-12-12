/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/shared/Transition";
import { useGetChaptersBySubjectQuery } from "@/lib/api/educationApi";
import { ChapterMultiSelect } from "@/components/subjects/ChaptersMultiSelect";

export default function SelectTopics() {
  const [chapterIds, setChapterIds] = useState<string[]>([]);
  const params = useParams();
  const router = useRouter();
  const selectedChapters = JSON.parse(localStorage.getItem("selectedChapters") || "[]");

  const boardSlug = params.board as any;
  const classSlug = params.class as string;
  const subjectSlug = params.subject as string;

  const boardName = boardSlug ? boardSlug?.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "";
  const className = classSlug ? classSlug?.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "";
  const subjectName = subjectSlug ? subjectSlug?.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "";

  const { data: chapters, isLoading: chaptersLoading } =
    useGetChaptersBySubjectQuery(
      { subjectSlug },
      {
        skip: !subjectSlug,
      }
    );

  const handleSubmit = () => {
    if (chapterIds.length === 0)  return
    localStorage.setItem("selectedChapters", JSON.stringify(chapterIds));
    router.push(
      `/${boardSlug}/${classSlug}/${subjectSlug}/select-questions`
    );
  };

  useEffect(() => {
    if(selectedChapters.length) {
      setChapterIds(selectedChapters)
    }
  }, [])
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link href={`/${boardSlug}/${classSlug}/select-subjects`}>
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
              {boardName} - {className} - {subjectName}
            </p>
          </motion.div>

          <ChapterMultiSelect
            chapters={chapters || []}
            loading={chaptersLoading}
            values={chapterIds}
            onChange={setChapterIds}
            onSubmit={() => handleSubmit()}
          />
        </div>
      </div>
    </PageTransition>
  );
}
