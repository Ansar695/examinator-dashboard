"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, ChevronRight, ArrowLeft } from "lucide-react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import CustomSpinner from "@/components/shared/CustomSpinner";
import { useGetBoardClassesQuery } from "@/lib/api/board";
import { useGetClassesByBoardQuery } from "@/lib/api/educationApi";
import { transformClasses } from "@/utils/ClassesCategoryTranformer";
import { slugToTitle } from "@/utils/transformers/slugToTitle";

const classTypeIcons = [
  {
    type: "Secondary",
    icon: <BookOpen className="w-8 h-8" />,
    color: "from-blue-500 to-blue-600",
  },
  {
    type: "High",
    icon: <GraduationCap className="w-8 h-8" />,
    color: "from-purple-500 to-purple-600",
  },
  {
    type: "INTERMEDIATE",
    icon: <GraduationCap className="w-8 h-8" />,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    type: "INTERMEDIATE",
    icon: <GraduationCap className="w-8 h-8" />,
    color: "from-indigo-500 to-indigo-600",
  },
];

const ClassSelection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currBoardSlug = pathname?.split("/")?.[1];
  const [categorizedClasses, setCategorizedClasses] = useState<any>([]);

  const searchParams = useSearchParams();
  const params = useParams();
  const boardSlug = params.board

  
  const {
    data: classes,
    isLoading,
    error,
  } = useGetClassesByBoardQuery(boardSlug as string, {
    skip: !boardSlug,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    if (classes) {
        const grouped = transformClasses(classes);
      const transformed = Object.keys(grouped).map((key) => ({
        type: key,
        classes: grouped[key],
      }));
      setCategorizedClasses(transformed);
    }
  }, [classes]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => router.push("/select-board")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Board Selection
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Select Your Class</h1>
          <p className="text-xl text-gray-600">
            Choose your class to access relevant study materials and question
            banks
          </p>
        </motion.div>

        {error && (
          <div className="rounded-md px-5 py-4 border flex flex-col items-center justify-center gap-3">
            <p className="text-center text-red-500 text-2xl font-bold ">
              No Classes found for this board.
            </p>
            <Button
              className="max-w-64 w-full h-10 hover:bg-blue-600 bg-blue-400 transition-colors"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        )}

        {/* Education Levels */}
        {isLoading ? (
          <CustomSpinner />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-8 max-w-6xl mx-auto"
          >
            {categorizedClasses?.map((level: any, levelIndex: number) => (
              <motion.div
                key={level?.type}
                variants={itemVariants}
                className="relative"
              >
                <Card className="overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${classTypeIcons?.[levelIndex]?.color} p-6 text-white`}
                  >
                    <div className="flex items-center gap-4">
                      {classTypeIcons?.[levelIndex]?.icon}
                      <h2 className="text-2xl font-semibold">{level?.type}</h2>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      {level?.classes?.length > 0 ? (
                        level?.classes?.map(
                          (classInfo: any, classIndex: number) => (
                            <motion.div
                              key={classInfo?.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                delay: levelIndex * 0.2 + classIndex * 0.1,
                              }}
                            >
                              <Card className="group hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                  <div className="text-center">
                                    <div className="mb-4">
                                      <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                        {classInfo?.name}
                                      </span>
                                      <span className="text-xl text-gray-600">
                                        th
                                      </span>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                      {classInfo?.name}th Class
                                    </p>
                                    <Button
                                      className="w-full group-hover:bg-blue-600 active:bg-green-800 cursor-pointer transition-colors"
                                      onClick={() =>
                                        router.push(
                                          `/${currBoardSlug}/${classInfo?.slug}/select-subjects`
                                        )
                                      }
                                    >
                                      Select
                                      <ChevronRight className="ml-2 w-4 h-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        )
                      ) : (
                        <p>No Class found.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-gray-600"
        >
          <p>
            Selected Board: <span className="font-semibold capitalize">{slugToTitle(currBoardSlug)}</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ClassSelection;
