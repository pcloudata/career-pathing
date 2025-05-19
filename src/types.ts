export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  proficiencyLevels: {
    level: number;
    name: string;
    description: string;
    criteria: string[];
  }[];
  relatedSkills: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: string[];
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  proficiency: number;
  confidence: number;
  lastAssessed: Date;
  lastUpdated: Date;
}

export interface AssessmentResult {
  userId: string;
  skills: UserSkill[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  overallScore: number;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export type SkillAssessmentError = ApiError | Error;

// Utility types
export type SkillMap = Record<string, Skill>;
export type SkillCategoryMap = Record<string, SkillCategory>;
export type UserSkillMap = Record<string, UserSkill>;

// Assessment types
export interface AssessmentOptions {
  userId: string;
  skillIds: string[];
  proficiency?: number;
  confidence?: number;
}

export interface AssessmentState {
  loading: boolean;
  error: SkillAssessmentError | null;
  skills: Skill[];
  skillCategories: SkillCategory[];
  userSkills: UserSkill[];
  selectedSkills: string[];
  assessmentResult: AssessmentResult | null;
}
