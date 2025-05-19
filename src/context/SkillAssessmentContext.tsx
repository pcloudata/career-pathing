import React, { createContext, useContext, useState, useEffect } from 'react';
import crypto from 'crypto';
import { Skill, SkillCategory, UserSkill, AssessmentResult, ApiError } from '../types';
import { apiService } from '../services/api';

interface SkillAssessmentContextType {
  skills: Skill[];
  skillCategories: SkillCategory[];
  userSkills: UserSkill[];
  selectedSkills: string[];
  assessmentResult: AssessmentResult | null;
  loading: boolean;
  error: ApiError | null;
  loadSkills: () => Promise<void>;
  loadSkillCategories: () => Promise<void>;
  assessSkills: (skillIds: string[]) => Promise<AssessmentResult>;
  updateSkillProficiency: (skillId: string, proficiency: number) => Promise<void>;
  selectSkill: (skillId: string) => void;
  deselectSkill: (skillId: string) => void;
  clearAssessment: () => void;
}

const SkillAssessmentContext = createContext<SkillAssessmentContextType | undefined>(undefined);

export const SkillAssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const userId = '1'; // TODO: Replace with actual user ID

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadSkills = async () => {
        try {
          const fetchedSkills = await apiService.functions.fetchSkills();
          setSkills(fetchedSkills);
        } catch (error) {
          console.error('Error loading skills:', error);
          setSkills([]);
        }
      };
      await loadSkills();
    } catch (error) {
      console.error('Error loading skills:', error);
      setError(error as ApiError);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSkillCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categories = await apiService.functions.fetchSkillCategories();
      setSkillCategories(categories);
    } catch (error) {
      console.error('Error loading skill categories:', error);
      setError(error as ApiError);
      setSkillCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const assessSkills = async (skillIds: string[]): Promise<AssessmentResult> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.functions.startAssessment(userId, skillIds);
      setAssessmentResult(result);
      return result;
    } catch (error) {
      console.error('Error starting assessment:', error);
      setError(error as ApiError);
      const fallbackResult: AssessmentResult = {
        userId,
        skills: userSkills.filter(skill => skillIds.includes(skill.skillId)),
        strengths: ['JavaScript', 'React'],
        weaknesses: ['Node.js', 'TypeScript'],
        recommendations: ['Take advanced JavaScript course', 'Start learning TypeScript'],
        overallScore: 75
      };
      setAssessmentResult(fallbackResult);
      return fallbackResult;
    } finally {
      setLoading(false);
    }
  };

  const updateSkillProficiency = async (skillId: string, proficiency: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedSkill = await apiService.functions.updateUserSkill(userId, skillId, proficiency);
      setUserSkills(prev => {
        const existingSkill = prev.find(s => s.skillId === skillId);
        if (existingSkill) {
          return prev.map(s => 
            s.skillId === skillId 
              ? { 
                  ...s, 
                  proficiency: updatedSkill.proficiency, 
                  lastAssessed: updatedSkill.lastAssessed,
                  lastUpdated: updatedSkill.lastUpdated
                }
              : s
          );
        }
        return [...prev, { 
          id: crypto.randomUUID(),
          userId,
          skillId,
          proficiency: updatedSkill.proficiency,
          confidence: 0.8,
          lastAssessed: updatedSkill.lastAssessed,
          lastUpdated: new Date()
        } as UserSkill];
      });
    } catch (error) {
      console.error('Error updating skill proficiency:', error);
      setError(error as ApiError);
      setUserSkills(prev => {
        const existingSkill = prev.find(s => s.skillId === skillId);
        if (existingSkill) {
          return prev.map(s => 
            s.skillId === skillId 
              ? { 
                  ...s, 
                  proficiency,
                  lastAssessed: new Date(),
                  lastUpdated: new Date()
                }
              : s
          );
        }
        return [...prev, { 
          id: crypto.randomUUID(),
          userId,
          skillId,
          proficiency,
          confidence: 0.8,
          lastAssessed: new Date(),
          lastUpdated: new Date()
        } as UserSkill];
      });
    } finally {
      setLoading(false);
    }
  };

  const selectSkill = (skillId: string) => {
    setSelectedSkills(prev => [...prev, skillId]);
  };

  const deselectSkill = (skillId: string) => {
    setSelectedSkills(prev => prev.filter(id => id !== skillId));
  };

  const clearAssessment = () => {
    setAssessmentResult(null);
  };

  useEffect(() => {
    loadSkills();
    loadSkillCategories();
  }, []);

  return (
    <SkillAssessmentContext.Provider value={{
      skills,
      skillCategories,
      userSkills,
      selectedSkills,
      assessmentResult,
      loading,
      error,
      loadSkills,
      loadSkillCategories,
      assessSkills,
      updateSkillProficiency,
      selectSkill,
      deselectSkill,
      clearAssessment
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

export default SkillAssessmentContext;
