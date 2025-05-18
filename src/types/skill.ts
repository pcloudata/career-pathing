export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  proficiencyLevels: ProficiencyLevel[];
  relatedSkills: string[];
}

export interface ProficiencyLevel {
  level: number;
  name: string;
  description: string;
  criteria: string[];
}

export interface UserSkill {
  skillId: string;
  proficiency: number;
  confidence: number;
  lastAssessed: Date;
}

export interface AssessmentResult {
  userId: string;
  skills: UserSkill[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  overallScore: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: string[];
}
