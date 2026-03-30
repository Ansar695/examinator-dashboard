"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Wand2,
} from "lucide-react";

import {
  Board,
  Chapter,
  Class,
  Subject,
  useGetBoardsQuery,
  useGetChaptersBySubjectQuery,
  useGetClassesByBoardQuery,
  useGetSubjectsByClassQuery,
} from "@/lib/api/educationApi";
import { ChapterMultiSelect } from "@/components/subjects/ChaptersMultiSelect";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import QuestionSelectionPanel from "@/components/questions/QuestionSelectionPanel";
import PaperWorkspace from "@/components/teacher/PaperWorkspace";
import CustomSpinner from "@/components/shared/CustomSpinner";
import { transformClasses } from "@/utils/ClassesCategoryTranformer";
import { slugToTitle } from "@/utils/transformers/slugToTitle";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type QuestionSettings = {
  mcqCount: number;
  mcqMarks: number;
  shortCount: number;
  shortMarks: number;
  shortOptional: number;
  longCount: number;
  longMarks: number;
  longOptional: number;
};

const defaultSettings: QuestionSettings = {
  mcqCount: 20,
  mcqMarks: 1,
  shortCount: 6,
  shortMarks: 5,
  shortOptional: 0,
  longCount: 4,
  longMarks: 10,
  longOptional: 0,
};

export default function TeacherPaperBuilder() {
  const [step, setStep] = useState(0);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [topicKeys, setTopicKeys] = useState<string[]>([]);
  const [activePaperId, setActivePaperId] = useState<string | null>(null);
  const [questionSettings, setQuestionSettings] =
    useState<QuestionSettings>(defaultSettings);

  const { data: boards, isLoading: boardsLoading } = useGetBoardsQuery();
  const { data: classes, isLoading: classesLoading } = useGetClassesByBoardQuery(
    selectedBoard?.id ?? "",
    {
      skip: !selectedBoard?.id,
    }
  );
  const { data: subjects, isLoading: subjectsLoading } =
    useGetSubjectsByClassQuery(
      {
        boardId: selectedBoard?.id ?? "",
        classId: selectedClass?.id ?? "",
      },
      {
        skip: !selectedBoard?.id || !selectedClass?.id,
      }
    );
  const { data: chapters, isLoading: chaptersLoading } =
    useGetChaptersBySubjectQuery(
      { subjectId: selectedSubject?.id ?? "" },
      {
        skip: !selectedSubject?.id,
      }
    );

  useEffect(() => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setTopicKeys([]);
    setActivePaperId(null);
  }, [selectedBoard?.id]);

  useEffect(() => {
    setSelectedSubject(null);
    setTopicKeys([]);
    setActivePaperId(null);
  }, [selectedClass?.id]);

  useEffect(() => {
    setTopicKeys([]);
    setActivePaperId(null);
  }, [selectedSubject?.id]);

  useEffect(() => {
    const hasProgress =
      step > 0 ||
      !!selectedBoard ||
      !!selectedClass ||
      !!selectedSubject ||
      topicKeys.length > 0;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasProgress) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step, selectedBoard, selectedClass, selectedSubject, topicKeys.length]);

  useEffect(() => {
    const hasProgress =
      step > 0 ||
      !!selectedBoard ||
      !!selectedClass ||
      !!selectedSubject ||
      topicKeys.length > 0;

    const handleClick = (event: MouseEvent) => {
      if (!hasProgress) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const confirmed = window.confirm(
        "Leave this page? Your current progress will be lost unless you save a draft."
      );
      if (!confirmed) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [step, selectedBoard, selectedClass, selectedSubject, topicKeys.length]);

  const classGroups = useMemo(() => {
    if (!classes?.length) return [];
    const grouped = transformClasses(classes);
    return Object.keys(grouped).map((key) => ({
      type: key,
      classes: grouped[key],
    }));
  }, [classes]);

  const totalSelectedTopics = topicKeys.length;
  const isReadyToContinue =
    !!selectedBoard &&
    !!selectedClass &&
    !!selectedSubject &&
    totalSelectedTopics > 0;

  const boardLabel = selectedBoard?.name
    ? slugToTitle(selectedBoard.name)
    : "Board";
  const classLabel = selectedClass?.name ?? "Class";
  const subjectLabel = selectedSubject?.name ?? "Subject";

  const handleQuestionCountChange = (
    key: keyof QuestionSettings,
    value: string
  ) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return;
    setQuestionSettings((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(500, numeric)),
    }));
  };

  const persistSelections = (chapterList: Chapter[]) => {
    const chapterIdSet = new Set<string>();
    const selectedTopicTitles: Record<string, string[]> = {};

    (chapterList || []).forEach((ch) => {
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
    localStorage.setItem(
      "selectedSubTopicsByChapter",
      JSON.stringify(selectedTopicTitles)
    );
    localStorage.setItem(
      "selectedChapters",
      JSON.stringify([...chapterIdSet])
    );
    const limits = {
      mcq: questionSettings.mcqCount,
      short: questionSettings.shortCount,
      long: questionSettings.longCount,
    };
    localStorage.setItem("questionLimits", JSON.stringify(limits));
    localStorage.setItem("questionSettings", JSON.stringify(questionSettings));
  };

  const handleStartSelection = () => {
    if (!selectedBoard || !selectedClass || !selectedSubject || !chapters)
      return;

    persistSelections(chapters);

    setStep(6);
  };

  const stepTitles = [
    "Board",
    "Class",
    "Subject",
    "Topics",
    "Number of questions",
    "Review",
    "Questions",
    "Paper Preview",
  ];

  const canContinue = () => {
    if (step === 0) return !!selectedBoard;
    if (step === 1) return !!selectedClass;
    if (step === 2) return !!selectedSubject;
    if (step === 3) return totalSelectedTopics > 0;
    if (step === 4) return true;
    if (step === 5) return isReadyToContinue;
    return true;
  };

  const nextStep = () => {
    if (!canContinue()) return;
    setStep((prev) => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div
      className={`${spaceGrotesk.className} relative min-h-screen overflow-hidden`}
      style={
        {
          "--accent": "#0ea5e9",
          "--accent-strong": "#0369a1",
          "--accent-2": "#a855f7",
          "--paper": "#f8fafc",
          "--ink": "#0f172a",
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,_rgba(168,85,247,0.12),_transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10">
        <header className="mb-8 space-y-3">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-[color:var(--ink)] sm:text-4xl">
                Premium paper builder
              </h1>
              <p className="max-w-xl text-sm text-slate-600 sm:text-base">
                Guided, animated steps. Everything stays in one place for speed
                and clarity.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500">
              {stepTitles.map((label, index) => {
                const done =
                  (index === 0 && !!selectedBoard) ||
                  (index === 1 && !!selectedClass) ||
                  (index === 2 && !!selectedSubject) ||
                  (index === 3 && totalSelectedTopics > 0) ||
                  index === 4 ||
                  (index === 5 && isReadyToContinue) ||
                  (index === 6 && step >= 6) ||
                  (index === 7 && step === 7);
                const isActive = index === step;
                return (
                  <div
                    key={label}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1 transition ${
                      done
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : isActive
                          ? "border-[color:var(--accent)] bg-[rgba(14,165,233,0.12)] text-[color:var(--accent-strong)]"
                          : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    <CheckCircle2
                      className={`h-3.5 w-3.5 ${
                        done ? "text-emerald-500" : "text-slate-300"
                      }`}
                    />
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        <div
          className={`grid gap-8 ${
            step >= 6 ? "grid-cols-1" : "lg:grid-cols-[1.6fr_0.4fr]"
          }`}
        >
          <div className="space-y-8">
            <Card className="border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Step {step + 1} of 8
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {stepTitles[step]}
                  </h2>
                </div>
                <Wand2 className="h-6 w-6 text-[color:var(--accent)]" />
              </div>

              <AnimatePresence mode="wait">
                {step === 6 && (
                  <motion.div
                    key="step-questions"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    {selectedBoard && selectedClass && selectedSubject ? (
                      <QuestionSelectionPanel
                        board={selectedBoard.slug}
                        classNumber={selectedClass.name}
                        subject={selectedSubject.slug}
                        subjectId={selectedSubject.id}
                        showHeader={false}
                        disableRedirect
                        onComplete={(paperId) => {
                          setActivePaperId(paperId);
                          setStep(7);
                        }}
                        onSaveDraft={(paperId) => {
                          setActivePaperId(paperId);
                        }}
                      />
                    ) : null}
                  </motion.div>
                )}
                {step === 7 && activePaperId && selectedBoard && selectedClass && selectedSubject && (
                  <motion.div
                    key="step-preview"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <PaperWorkspace
                      board={selectedBoard.slug}
                      classNumber={selectedClass.name}
                      subject={selectedSubject.slug}
                      paperId={activePaperId}
                      subjectId={selectedSubject.id}
                    />
                  </motion.div>
                )}
                {step === 0 && (
                  <motion.div
                    key="step-board"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    {boardsLoading ? (
                      <div className="py-8">
                        <CustomSpinner />
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {boards?.map((board) => {
                          const isActive = selectedBoard?.id === board.id;
                          return (
                            <button
                              key={board.id}
                              type="button"
                              onClick={() => setSelectedBoard(board)}
                              className={`group relative flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition ${
                                isActive
                                  ? "border-[color:var(--accent)] bg-[rgba(14,165,233,0.12)] shadow-md"
                                  : "border-slate-200 bg-white hover:border-[color:var(--accent)] hover:bg-slate-50"
                              }`}
                            >
                              <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                                <Image
                                  src={board.logoUrl || "/placeholder.svg"}
                                  alt={board.name}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-base font-semibold text-slate-900">
                                  {board.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {board.description || "Curriculum ready"}
                                </p>
                              </div>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  isActive
                                    ? "bg-[color:var(--accent)] text-white"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {isActive ? "Selected" : "Choose"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step-class"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    {!selectedBoard ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                        Choose a board to unlock its classes.
                      </div>
                    ) : classesLoading ? (
                      <div className="py-8">
                        <CustomSpinner />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {classGroups.map((group) => (
                          <div key={group.type}>
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                              {group.type.replace(/_/g, " ")}
                            </p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                              {group.classes.map((classItem: Class) => {
                                const isActive =
                                  selectedClass?.id === classItem.id;
                                return (
                                  <button
                                    key={classItem.id}
                                    type="button"
                                    onClick={() => setSelectedClass(classItem)}
                                    className={`rounded-xl border px-4 py-3 text-left transition ${
                                      isActive
                                        ? "border-[color:var(--accent)] bg-[rgba(14,165,233,0.12)] shadow-md"
                                        : "border-slate-200 bg-white hover:border-[color:var(--accent)] hover:bg-slate-50"
                                    }`}
                                  >
                                    <p className="text-lg font-semibold text-slate-900">
                                      Class {classItem.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {classItem.type.replace(/_/g, " ")}
                                    </p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-subject"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    {!selectedClass ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                        Select a class to view its subjects.
                      </div>
                    ) : subjectsLoading ? (
                      <div className="py-8">
                        <CustomSpinner />
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {subjects?.map((subject) => {
                          const isActive = selectedSubject?.id === subject.id;
                          return (
                            <button
                              key={subject.id}
                              type="button"
                              onClick={() => setSelectedSubject(subject)}
                              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                                isActive
                                  ? "border-[color:var(--accent-2)] bg-[rgba(168,85,247,0.12)] shadow-md"
                                  : "border-slate-200 bg-white hover:border-[color:var(--accent-2)] hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
                                  <Image
                                    src={
                                      subject.imageUrl ||
                                      "/placeholder-subject.jpg"
                                    }
                                    alt={subject.name}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-base font-semibold text-slate-900">
                                    {subject.name}
                                  </p>
                                  <p className="text-xs text-slate-500 line-clamp-2">
                                    {subject.description ||
                                      "Exam-ready question bank"}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-topics"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    {!selectedSubject ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                        Choose a subject to see chapters and subtopics.
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5 shadow-inner">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                              Chapter focus
                            </p>
                            <h3 className="text-lg font-semibold text-slate-900">
                              Select chapters and subtopics
                            </h3>
                          </div>
                          <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                            {topicKeys.length} selected
                          </div>
                        </div>
                        <div className="rounded-xl bg-white/80 p-4 ring-1 ring-slate-200/70">
                          <ChapterMultiSelect
                            chapters={chapters || []}
                            loading={chaptersLoading}
                            values={topicKeys}
                            onChange={setTopicKeys}
                            onSubmit={nextStep}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step-counts"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <div className="space-y-5">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        Set how many questions to include and how each question
                        is scored. Optional questions are extra questions shown
                        to students (they can choose any).
                      </div>
                      <div className="grid gap-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                MCQs
                              </p>
                              <p className="text-xs text-slate-500">
                                Quick checks, 1 correct option
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-600">
                                Number of MCQs
                              </label>
                              <Input
                                type="number"
                                min={0}
                                max={500}
                                value={questionSettings.mcqCount}
                                onChange={(e) =>
                                  handleQuestionCountChange(
                                    "mcqCount",
                                    e.target.value
                                  )
                                }
                                className="h-11 text-base"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-600">
                                Marks per MCQ
                              </label>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={questionSettings.mcqMarks}
                                onChange={(e) =>
                                  handleQuestionCountChange(
                                    "mcqMarks",
                                    e.target.value
                                  )
                                }
                                className="h-11 text-base"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              Short Questions
                            </p>
                            <p className="text-xs text-slate-500">
                              2–5 lines, fast evaluation
                            </p>
                          </div>
                          <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-600">
                                Required short questions
                              </label>
                              <Input
                                type="number"
                                min={0}
                                max={500}
                                value={questionSettings.shortCount}
                                onChange={(e) =>
                                  handleQuestionCountChange(
                                    "shortCount",
                                    e.target.value
                                  )
                                }
                                className="h-11 text-base"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-600">
                                Marks per short
                              </label>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={questionSettings.shortMarks}
                                onChange={(e) =>
                                  handleQuestionCountChange(
                                    "shortMarks",
                                    e.target.value
                                  )
                                }
                                className="h-11 text-base"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-600">
                                Optional short questions
                              </label>
                              <Input
                                type="number"
                                min={0}
                                max={500}
                                value={questionSettings.shortOptional}
                                onChange={(e) =>
                                  handleQuestionCountChange(
                                    "shortOptional",
                                    e.target.value
                                  )
                                }
                                className="h-11 text-base"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              Long Questions
                            </p>
                            <p className="text-xs text-slate-500">
                              Detailed answers, multi-step reasoning
                            </p>
                          </div>
                          <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-600">
                                Required long questions
                              </label>
                              <Input
                                type="number"
                                min={0}
                                max={500}
                                value={questionSettings.longCount}
                                onChange={(e) =>
                                  handleQuestionCountChange(
                                    "longCount",
                                    e.target.value
                                  )
                                }
                                className="h-11 text-base"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-600">
                                Marks per long
                              </label>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={questionSettings.longMarks}
                                onChange={(e) =>
                                  handleQuestionCountChange(
                                    "longMarks",
                                    e.target.value
                                  )
                                }
                                className="h-11 text-base"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-600">
                                Optional long questions
                              </label>
                              <Input
                                type="number"
                                min={0}
                                max={500}
                                value={questionSettings.longOptional}
                                onChange={(e) =>
                                  handleQuestionCountChange(
                                    "longOptional",
                                    e.target.value
                                  )
                                }
                                className="h-11 text-base"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step-review"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Review & launch
                      </h3>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs uppercase tracking-widest text-slate-400">
                            Context
                          </p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">
                            {selectedBoard ? boardLabel : "Board"}
                          </p>
                          <p className="text-sm text-slate-600">
                            Class {selectedClass?.name ?? "Class"}
                          </p>
                          <p className="text-sm text-slate-600">
                            {selectedSubject?.name ?? "Subject"}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs uppercase tracking-widest text-slate-400">
                            Question mix
                          </p>
                          <div className="mt-2 space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>MCQs</span>
                            <span className="font-semibold text-slate-900">
                              {questionSettings.mcqCount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Short</span>
                            <span className="font-semibold text-slate-900">
                              {questionSettings.shortCount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Long</span>
                            <span className="font-semibold text-slate-900">
                              {questionSettings.longCount}
                            </span>
                          </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
                        {totalSelectedTopics} topic selections will be used to
                        fetch the best question sets.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {step < 6 ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                onClick={prevStep}
                disabled={step === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              {step < 5 ? (
                <Button
                  className="gap-2 bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)]"
                  onClick={nextStep}
                  disabled={!canContinue()}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="gap-2 bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)]"
                  onClick={handleStartSelection}
                  disabled={!isReadyToContinue}
                >
                  Open Question Selection
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
            ) : null}
          </div>

            {step < 6 ? (
          <div className="space-y-6">
            <Card className="sticky top-6 border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-200/60 max-w-sm ml-auto">
              <h3 className="text-xl font-semibold text-slate-900">
                Live Summary
              </h3>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Board</span>
                  <span className="font-semibold text-slate-900">
                    {selectedBoard ? boardLabel : "Not selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Class</span>
                  <span className="font-semibold text-slate-900">
                    {selectedClass ? classLabel : "Not selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subject</span>
                  <span className="font-semibold text-slate-900">
                    {selectedSubject ? subjectLabel : "Not selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Topics selected</span>
                  <span className="font-semibold text-slate-900">
                    {totalSelectedTopics}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-700">Question mix</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span>MCQs</span>
                    <span className="font-semibold text-slate-900">
                      {questionSettings.mcqCount}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span>Short</span>
                    <span className="font-semibold text-slate-900">
                      {questionSettings.shortCount}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span>Long</span>
                    <span className="font-semibold text-slate-900">
                      {questionSettings.longCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 text-sm text-slate-600">
                Keep going, you are {step + 1} steps in.
              </div>
            </Card>
          </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
