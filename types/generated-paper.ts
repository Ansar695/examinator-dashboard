export type GeneratedPaperSubject = {
  id: string;
  name: string;
  slug: string;
};

export type GeneratedPaperBoard = {
  id: string;
  name: string;
  slug: string;
};

export type GeneratedPaperClass = {
  id: string;
  name: string;
  slug: string;
};

export type GeneratedPaper = {
  id: string;
  title: string;
  totalMarks: number;
  examTime: string | null;
  subjectId: string;
  boardId: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
  subject: GeneratedPaperSubject;
  board: GeneratedPaperBoard;
  class: GeneratedPaperClass;
  mcqs: unknown[];
  shortQs: unknown[];
  longQs: unknown[];
};

export type GeneratedPapersMeta = {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export type GeneratedPapersResponse = {
  success: boolean;
  data: GeneratedPaper[];
  meta: GeneratedPapersMeta;
};

export type GeneratedPapersSortBy = "createdAt" | "title" | "totalMarks";
export type GeneratedPapersSortOrder = "asc" | "desc";

export type GeneratedPapersQueryArgs = {
  search?: string;
  page?: number;
  limit?: number;
  subjectIds?: string[];
  sortBy?: GeneratedPapersSortBy;
  sortOrder?: GeneratedPapersSortOrder;
};

