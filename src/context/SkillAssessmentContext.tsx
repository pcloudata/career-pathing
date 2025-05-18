import React, { createContext, useContext, useState, useEffect } from 'react';
import { Skill, UserSkill, AssessmentResult } from '../types/skill';

interface SkillAssessmentContextType {
  skills: Skill[];
  userSkills: UserSkill[];
  selectedSkills: string[];
  assessmentResult: AssessmentResult | null;
  loadSkills: () => Promise<void>;
  assessSkills: (skillIds: string[]) => Promise<AssessmentResult>;
  updateSkillProficiency: (skillId: string, proficiency: number) => void;
  handleSkillSelect: (skillId: string) => void;
  startAssessment: () => void;
}

const SkillAssessmentContext = createContext<SkillAssessmentContextType | undefined>(undefined);

export const SkillAssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const loadSkills = async () => {
    // TODO: Implement API call to fetch skills
    // For now, using mock data
    const mockSkills: Skill[] = [
      {
        id: '1',
        name: 'JavaScript',
        category: 'Programming Languages',
        description: 'A programming language that is commonly used to create interactive effects within web browsers.',
        proficiencyLevels: [
          { level: 1, name: 'Beginner', description: 'Basic understanding', criteria: ['Knows basic syntax', 'Can write simple scripts'] },
          { level: 2, name: 'Intermediate', description: 'Comfortable with core concepts', criteria: ['Understands DOM manipulation', 'Can use ES6+ features'] },
          { level: 3, name: 'Advanced', description: 'Expert knowledge', criteria: ['Can write complex applications', 'Understands async programming'] }
        ],
        relatedSkills: ['React', 'Node.js', 'TypeScript']
      },
      {
        id: '2',
        name: 'React',
        category: 'Frontend Frameworks',
        description: 'A JavaScript library for building user interfaces.',
        proficiencyLevels: [
          { level: 1, name: 'Beginner', description: 'Basic component creation', criteria: ['Can create functional components', 'Understands props'] },
          { level: 2, name: 'Intermediate', description: 'State management and hooks', criteria: ['Uses useState and useEffect', 'Understands context'] },
          { level: 3, name: 'Advanced', description: 'Expert knowledge', criteria: ['Builds complex applications', 'Understands performance optimization'] }
        ],
        relatedSkills: ['JavaScript', 'TypeScript', 'Redux']
      },
      {
        id: '3',
        name: 'Python',
        category: 'Programming Languages',
        description: 'A high-level programming language with a focus on code readability.',
        proficiencyLevels: [
          { level: 1, name: 'Beginner', description: 'Basic syntax and data structures', criteria: ['Can write simple scripts', 'Understands loops and conditionals'] },
          { level: 2, name: 'Intermediate', description: 'Advanced concepts', criteria: ['Uses classes and objects', 'Understands file operations'] },
          { level: 3, name: 'Advanced', description: 'Expert knowledge', criteria: ['Builds complex applications', 'Understands async programming'] }
        ],
        relatedSkills: ['Data Science', 'Machine Learning', 'Django']
      },
      {
        id: '4',
        name: 'SQL',
        category: 'Database',
        description: 'Structured Query Language for managing and querying databases.',
        proficiencyLevels: [
          { level: 1, name: 'Beginner', description: 'Basic queries', criteria: ['Can write SELECT statements', 'Understands basic joins'] },
          { level: 2, name: 'Intermediate', description: 'Advanced queries', criteria: ['Writes complex queries', 'Understands indexing'] },
          { level: 3, name: 'Advanced', description: 'Expert knowledge', criteria: ['Optimizes queries', 'Understands database design'] }
        ],
        relatedSkills: ['Data Analysis', 'Database Design', 'ETL']
      }
    ];
    setSkills(mockSkills);
  };

  const assessSkills = async (skillIds: string[]): Promise<AssessmentResult> => {
    // TODO: Implement actual assessment logic
    const result: AssessmentResult = {
      userId: '1',
      skills: userSkills.filter(skill => skillIds.includes(skill.skillId)),
      strengths: ['JavaScript', 'React'],
      weaknesses: ['Node.js', 'TypeScript'],
      recommendations: ['Take advanced JavaScript course', 'Start learning TypeScript'],
      overallScore: 75
    };
    setAssessmentResult(result);
    return result;
  };

  const updateSkillProficiency = (skillId: string, proficiency: number) => {
    setUserSkills(prev => {
      const existingSkill = prev.find(s => s.skillId === skillId);
      if (existingSkill) {
        return prev.map(s => 
          s.skillId === skillId 
            ? { ...s, proficiency, lastAssessed: new Date() }
            : s
        );
      }
      return [...prev, { skillId, proficiency, confidence: 0.8, lastAssessed: new Date() }];
    });
  };

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const startAssessment = () => {
    if (selectedSkills.length === 0) {
      alert('Please select at least one skill to assess');
      return;
    }
    setAssessmentResult(null);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  return (
    <SkillAssessmentContext.Provider value={{
      skills,
      userSkills,
      selectedSkills,
      assessmentResult,
      loadSkills,
      assessSkills,
      updateSkillProficiency,
      handleSkillSelect,
      startAssessment
    }}>
      {children}
    </SkillAssessmentContext.Provider>
  );
};

export const useSkillAssessment = () => {
  const context = useContext(SkillAssessmentContext);
  if (context === undefined) {
    throw new Error('useSkillAssessment must be used within a SkillAssessmentProvider');
  }
  return context;
};
