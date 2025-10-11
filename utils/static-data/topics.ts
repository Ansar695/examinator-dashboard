export type Subtopic = string;

export type Topic = {
  name: string;
  subtopics: Subtopic[];
};

export type SubjectTopics = {
  [subject: string]: Topic[];
};

export type ClassTopics = {
  [classNumber: string]: SubjectTopics;
};

export type BoardTopics = {
  [board: string]: ClassTopics;
};

export const topicsData: BoardTopics = {
  'punjab-board': {
    '6th': {
      'mathematics': [
        { name: 'Algebra', subtopics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'] },
        { name: 'Geometry', subtopics: ['Triangles', 'Circles', 'Coordinate Geometry'] },
        { name: 'Trigonometry', subtopics: ['Trigonometric Ratios', 'Heights and Distances'] },
        { name: 'Statistics', subtopics: ['Data Collection', 'Measures of Central Tendency'] },
      ],
      'computer-science': [
        { name: 'Physics', subtopics: ['Motion', 'Force and Laws of Motion', 'Gravitation'] },
        { name: 'Chemistry', subtopics: ['Atoms and Molecules', 'Structure of Atom', 'Chemical Reactions'] },
        { name: 'Biology', subtopics: ['Cell - The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms'] },
      ],
    },
    '7th': {
      'mathematics': [
        { name: 'Algebra', subtopics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'] },
        { name: 'Geometry', subtopics: ['Triangles', 'Circles', 'Coordinate Geometry'] },
        { name: 'Trigonometry', subtopics: ['Trigonometric Ratios', 'Heights and Distances'] },
        { name: 'Statistics', subtopics: ['Data Collection', 'Measures of Central Tendency'] },
      ],
      'computer-science': [
        { name: 'Physics', subtopics: ['Motion', 'Force and Laws of Motion', 'Gravitation'] },
        { name: 'Chemistry', subtopics: ['Atoms and Molecules', 'Structure of Atom', 'Chemical Reactions'] },
        { name: 'Biology', subtopics: ['Cell - The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms'] },
      ],
    },
    '8th': {
      'mathematics': [
        { name: 'Algebra', subtopics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'] },
        { name: 'Geometry', subtopics: ['Triangles', 'Circles', 'Coordinate Geometry'] },
        { name: 'Trigonometry', subtopics: ['Trigonometric Ratios', 'Heights and Distances'] },
        { name: 'Statistics', subtopics: ['Data Collection', 'Measures of Central Tendency'] },
      ],
      'computer-science': [
        { name: 'Physics', subtopics: ['Motion', 'Force and Laws of Motion', 'Gravitation'] },
        { name: 'Chemistry', subtopics: ['Atoms and Molecules', 'Structure of Atom', 'Chemical Reactions'] },
        { name: 'Biology', subtopics: ['Cell - The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms'] },
      ],
    },
    '9th': {
      'mathematics': [
        { name: 'Algebra', subtopics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'] },
        { name: 'Geometry', subtopics: ['Triangles', 'Circles', 'Coordinate Geometry'] },
        { name: 'Trigonometry', subtopics: ['Trigonometric Ratios', 'Heights and Distances'] },
        { name: 'Statistics', subtopics: ['Data Collection', 'Measures of Central Tendency'] },
      ],
      'computer-science': [
        { name: 'Physics', subtopics: ['Motion', 'Force and Laws of Motion', 'Gravitation'] },
        { name: 'Chemistry', subtopics: ['Atoms and Molecules', 'Structure of Atom', 'Chemical Reactions'] },
        { name: 'Biology', subtopics: ['Cell - The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms'] },
      ],
    },
    '10th': {
      'mathematics': [
        { name: 'Algebra', subtopics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'] },
        { name: 'Geometry', subtopics: ['Triangles', 'Circles', 'Coordinate Geometry'] },
        { name: 'Trigonometry', subtopics: ['Trigonometric Ratios', 'Heights and Distances'] },
        { name: 'Statistics', subtopics: ['Data Collection', 'Measures of Central Tendency'] },
      ],
      'computer-science': [
        { name: 'Physics', subtopics: ['Motion', 'Force and Laws of Motion', 'Gravitation'] },
        { name: 'Chemistry', subtopics: ['Atoms and Molecules', 'Structure of Atom', 'Chemical Reactions'] },
        { name: 'Biology', subtopics: ['Cell - The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms'] },
      ],
    },
    '11th': {
      'mathematics': [
        { name: 'Algebra', subtopics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'] },
        { name: 'Geometry', subtopics: ['Triangles', 'Circles', 'Coordinate Geometry'] },
        { name: 'Trigonometry', subtopics: ['Trigonometric Ratios', 'Heights and Distances'] },
        { name: 'Statistics', subtopics: ['Data Collection', 'Measures of Central Tendency'] },
      ],
      'computer-science': [
        { name: 'Physics', subtopics: ['Motion', 'Force and Laws of Motion', 'Gravitation'] },
        { name: 'Chemistry', subtopics: ['Atoms and Molecules', 'Structure of Atom', 'Chemical Reactions'] },
        { name: 'Biology', subtopics: ['Cell - The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms'] },
      ],
    },
    '12th': {
      'mathematics': [
        { name: 'Algebra', subtopics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'] },
        { name: 'Geometry', subtopics: ['Triangles', 'Circles', 'Coordinate Geometry'] },
        { name: 'Trigonometry', subtopics: ['Trigonometric Ratios', 'Heights and Distances'] },
        { name: 'Statistics', subtopics: ['Data Collection', 'Measures of Central Tendency'] },
      ],
      'computer-science': [
        { name: 'Physics', subtopics: ['Motion', 'Force and Laws of Motion', 'Gravitation'] },
        { name: 'Chemistry', subtopics: ['Atoms and Molecules', 'Structure of Atom', 'Chemical Reactions'] },
        { name: 'Biology', subtopics: ['Cell - The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms'] },
      ],
    },
  },
  'federal-board': {
    '9th': {
      'English': [
        { name: 'Grammar', subtopics: ['Parts of Speech', 'Tenses', 'Active and Passive Voice'] },
        { name: 'Literature', subtopics: ['Poetry Analysis', 'Prose Comprehension', 'Character Studies'] },
        { name: 'Writing', subtopics: ['Essay Writing', 'Letter Writing', 'Story Writing'] },
      ],
      'Social Studies': [
        { name: 'History', subtopics: ['Ancient Civilizations', 'Medieval Period', 'Modern Era'] },
        { name: 'Geography', subtopics: ['Physical Geography', 'Human Geography', 'Environmental Studies'] },
        { name: 'Civics', subtopics: ['Government Systems', 'Citizenship', 'Rights and Responsibilities'] },
      ],
    },
  },
};

