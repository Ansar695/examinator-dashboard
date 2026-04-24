export interface BoardTypes {
    id: string;
    name: string;
    image: string;
    slug: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    classes: ClassTypes[];
    subjects: SubjectTypes[];
}

export interface ClassTypes {
    boardId: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    id: string;
    slug: string;
    type: string;
}

export interface SubjectTypes {
    boardId: string;
    classId: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    image: string;
    id: string;
    slug: string;
    description: string;
}