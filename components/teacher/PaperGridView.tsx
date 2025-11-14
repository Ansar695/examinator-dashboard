"use client";
import React from "react";
import {
  Calendar,
  Clock,
  FileText,
  BookOpen,
  GraduationCap,
  Eye,
  Trash2,
  Award,
  Edit,
  ChevronRight,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/transformers/formatDate";
import { useRouter } from "next/navigation";

export const PaperGridView = ({ paper, handleViewPaper, handlePaperDelete }: any) => {
  const router = useRouter();
  const totalQuestions = (paper.mcqs?.length || 0) + (paper.shortQs?.length || 0) + (paper.longQs?.length || 0);
  
  const handleEditPaper = (paper: any) => {
    router.push(
      `/${paper?.board?.slug}/${paper?.class?.name}/${paper?.subject?.slug}/view-paper?paperId=${paper.id}&subjectId=${paper.subjectId}`
    );
  };

  return (
    <Card className="group relative overflow-hidden border-2 border-gray-200 hover:border-primary/50 dark:border-gray-800 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-2xl bg-white dark:bg-gray-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500" />

      <CardHeader className="relative">
        {/* Header with class badge and marks */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-1.5 text-sm font-bold shadow-lg">
            Class {paper.class?.name}
          </Badge>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-800">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
              {paper.totalMarks} Marks
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="capitalize text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-4 leading-tight group-hover:text-primary transition-colors">
          {paper?.title}
        </h3>

        {/* Meta information */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{formatDate(paper.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{paper.examTime}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative py-0">
        {/* Question type cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* MCQs */}
          <div className="relative group/card rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 p-2 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:scale-105">
            <div className="flex flex-col items-center text-center gap-1">
              <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-black text-blue-700 dark:text-blue-300 leading-none">
                {paper.mcqs?.length || 0}
              </div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                MCQs
              </div>
            </div>
          </div>

          {/* Short Questions */}
          <div className="relative group/card rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30 p-2 border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:scale-105">
            <div className="flex flex-col items-center text-center gap-1">
              <div className="p-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300 leading-none">
                {paper.shortQs?.length || 0}
              </div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Short
              </div>
            </div>
          </div>

          {/* Long Questions */}
          <div className="relative group/card rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 p-2 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:scale-105">
            <div className="flex flex-col items-center text-center gap-1">
              <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-black text-purple-700 dark:text-purple-300 leading-none">
                {paper.longQs?.length || 0}
              </div>
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                Long
              </div>
            </div>
          </div>
        </div>

        {/* Total summary bar */}
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Total Questions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-primary">
              {totalQuestions}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative pt-0 flex flex-col gap-3">
        {/* Primary action button */}
        <Button
          variant="default"
          size="lg"
          className="w-full cursor-pointer bg-gradient-to-r from-primary to-primary/90 hover:bg-green-900 hover:from-primary/90 hover:to-primary font-bold text-base shadow-lg hover:shadow-xl transition-all group/btn"
          onClick={() => handleViewPaper(paper)}
        >
          <Eye className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform" />
          View Paper
          <ChevronRight className="w-5 h-5 ml-auto group-hover/btn:translate-x-1 transition-transform" />
        </Button>

        {/* Secondary actions */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="default"
            className="flex-1 cursor-pointer font-semibold border-2 hover:text-black hover:bg-primary/5 hover:border-primary transition-all"
            onClick={() => handleEditPaper(paper)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="default"
            className="flex-1 cursor-pointer font-semibold border-2 border-red-200 hover:text-red-500 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950 transition-all"
            onClick={() => handlePaperDelete(paper?.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};