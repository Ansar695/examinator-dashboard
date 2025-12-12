"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/shared/Transition";
import CustomSpinner from "@/components/shared/CustomSpinner";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { Subject, useGetSubjectsByClassQuery } from "@/lib/api/educationApi";

// This would typically come from an API or database

export default function SelectSubject() {
  const params = useParams();
  const router = useRouter();

  const boardSlug = params?.board as string;
  const classSlug = params?.class as string;

  const { data: subjects, isLoading: subjectsLoading } =
    useGetSubjectsByClassQuery({ boardSlug, classSlug });

  const handleSubjectSelection = (slug: string) => {
    router.push(
      `/${boardSlug}/${classSlug}/${slug}/select-topics`
    );
  };

  const boardName = boardSlug ? boardSlug?.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "";
  const className = classSlug ? classSlug?.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "";

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link href={`/${boardSlug}/select-class`}>
              <Button
                variant="ghost"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Class Selection
              </Button>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-center mb-4">
              Select Your Subject
            </h1>
            <p className="text-xl text-gray-600 text-center mb-12 capitalize">
              {boardName} - {className}
            </p>
          </motion.div>
          {subjectsLoading ? (
            <CustomSpinner />
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subjects?.length && subjects?.map((subject: Subject, index: number) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <SubjectCard
                    subject={subject}
                    onSelect={() =>
                      handleSubjectSelection(subject?.slug)
                    }
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
