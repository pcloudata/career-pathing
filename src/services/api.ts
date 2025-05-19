import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, Timestamp, getDoc, DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { Skill, SkillCategory, UserSkill, ApiError, AssessmentResult } from '../types';

// Types
export type ApiService = typeof db;
export type ApiFunctions = {
  fetchSkills: () => Promise<Skill[]>;
  fetchSkillCategories: () => Promise<SkillCategory[]>;
  getUserSkills: (userId: string) => Promise<UserSkill[]>;
  updateUserSkill: (userId: string, skillId: string, proficiency: number) => Promise<UserSkill>;
  startAssessment: (userId: string, skillIds: string[]) => Promise<AssessmentResult>;
};

export type ApiTypes = {
  api: ApiService;
  functions: ApiFunctions;
};

// Error handling utilities
const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'ERROR_OCCURRED',
      details: error.stack || undefined
    };
  } else if (typeof error === 'string') {
    return {
      message: error,
      code: 'ERROR_OCCURRED',
      details: undefined
    };
  } else {
    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      details: undefined
    };
  }
};

// Skills API
export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    const skillsRef = collection(db, 'skills');
    const snapshot = await getDocs(skillsRef);
    return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data() as Skill | undefined;
      if (!data) {
        throw new Error('Invalid skill data');
      }
      return {
        id: doc.id,
        name: data.name,
        category: data.category,
        description: data.description,
        proficiencyLevels: data.proficiencyLevels || [],
        relatedSkills: data.relatedSkills || []
      } as Skill;
    });
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchSkillCategories = async (): Promise<SkillCategory[]> => {
  try {
    const categoriesRef = collection(db, 'skillCategories');
    const snapshot = await getDocs(categoriesRef);
    return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data() as { name: string; description: string; skills?: string[] };
      if (!data) {
        throw new Error('Invalid document data');
      }
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        skills: data.skills || []
      } as SkillCategory;
    });
  } catch (error) {
    throw handleApiError(error);
  }
};

// User Skills API
export const getUserSkills = async (userId: string): Promise<UserSkill[]> => {
  try {
    const userSkillsRef = collection(db, 'userSkills');
    const q = query(userSkillsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data() as {
        userId: string;
        skillId: string;
        proficiency: number;
        confidence?: number;
        lastAssessed?: Timestamp | Date;
        lastUpdated?: Timestamp | Date;
      };
      if (!data) {
        throw new Error('Invalid document data');
      }
      return {
        id: doc.id,
        userId: data.userId,
        skillId: data.skillId,
        proficiency: data.proficiency,
        confidence: data.confidence || 0.8,
        lastAssessed: data.lastAssessed instanceof Timestamp ? data.lastAssessed.toDate() : data.lastAssessed || new Date(),
        lastUpdated: data.lastUpdated instanceof Timestamp ? data.lastUpdated.toDate() : data.lastUpdated || new Date()
      };
    });
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateUserSkill = async (userId: string, skillId: string, proficiency: number): Promise<UserSkill> => {
  if (!userId || !skillId) {
    throw new Error('userId and skillId are required');
  }
  if (proficiency < 0 || proficiency > 100) {
    throw new Error('Proficiency must be between 0 and 100');
  }
  try {
    const userSkillsRef = collection(db, 'userSkills');
    const q = query(userSkillsRef, where('userId', '==', userId), where('skillId', '==', skillId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      const updatedData = {
        proficiency,
        lastUpdated: Timestamp.now()
      };
      await updateDoc(docRef, updatedData);
      
      // Get the updated document
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data();
      if (!data) {
        throw new Error('Failed to retrieve updated document data');
      }
      return {
        id: updatedDoc.id,
        userId: data.userId,
        skillId: data.skillId,
        proficiency: data.proficiency,
        confidence: data.confidence || 0.8,
        lastAssessed: data.lastAssessed instanceof Timestamp ? data.lastAssessed.toDate() : new Date(),
        lastUpdated: data.lastUpdated instanceof Timestamp ? data.lastUpdated.toDate() : new Date()
      } as UserSkill;
    } else {
      const docRef = await addDoc(userSkillsRef, {
        userId,
        skillId,
        proficiency,
        confidence: 0.8,
        lastAssessed: Timestamp.now(),
        lastUpdated: Timestamp.now()
      });
      
      // Get the newly created document
      const createdDoc = await getDoc(docRef);
      const data = createdDoc.data();
      if (!data) {
        throw new Error('Failed to create user skill document');
      }
      return {
        id: createdDoc.id,
        userId: data.userId,
        skillId: data.skillId,
        proficiency: data.proficiency,
        confidence: data.confidence || 0.8,
        lastAssessed: data.lastAssessed instanceof Timestamp ? data.lastAssessed.toDate() : new Date(),
        lastUpdated: data.lastUpdated instanceof Timestamp ? data.lastUpdated.toDate() : new Date()
      } as UserSkill;
    }
  } catch (error) {
    throw handleApiError(error);
  }
};

// Assessment API
export const startAssessment = async (userId: string, skillIds: string[]): Promise<AssessmentResult> => {
  if (!userId) {
    throw new Error('userId is required');
  }
  if (!Array.isArray(skillIds)) {
    throw new Error('skillIds must be an array');
  }
  try {
    if (skillIds.length === 0) {
      throw new Error('No skills selected for assessment');
    }

    // Get user skills for the selected skills
    const userSkills = await getUserSkills(userId);
    const selectedUserSkills = userSkills.filter(skill => skillIds.includes(skill.skillId));

    if (selectedUserSkills.length === 0) {
      throw new Error('No user skills found for the selected skills');
    }

    // Create assessment result
    const assessmentRef = collection(db, 'assessments');
    const docRef = await addDoc(assessmentRef, {
      userId,
      skills: selectedUserSkills.map(skill => ({
        id: skill.id,
        skillId: skill.skillId,
        proficiency: skill.proficiency,
        confidence: skill.confidence,
        lastAssessed: Timestamp.fromDate(skill.lastAssessed),
        lastUpdated: Timestamp.fromDate(skill.lastUpdated)
      })),
      timestamp: Timestamp.now(),
      status: 'completed'
    });

    // Calculate statistics
    const totalSkills = selectedUserSkills.length;
    const proficiencySum = selectedUserSkills.reduce((sum, skill) => sum + skill.proficiency, 0);
    const averageProficiency = proficiencySum / totalSkills;
    const proficiencyDistribution = selectedUserSkills.reduce((acc, skill) => {
      const proficiencyBracket = Math.floor(skill.proficiency / 20) * 20;
      acc[proficiencyBracket] = (acc[proficiencyBracket] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Generate recommendations based on proficiency distribution
    const recommendations = [];
    if (proficiencyDistribution[0] || proficiencyDistribution[20]) {
      recommendations.push('Focus on fundamental concepts');
    }
    if (proficiencyDistribution[40] || proficiencyDistribution[60]) {
      recommendations.push('Practice more advanced topics');
    }
    if (proficiencyDistribution[80] || proficiencyDistribution[100]) {
      recommendations.push('Consider mentoring others');
    }

    return {
      id: docRef.id,
      userId,
      skills: selectedUserSkills,
      strengths: selectedUserSkills
        .filter(skill => skill.proficiency >= 80)
        .map(skill => skill.skillId),
      weaknesses: selectedUserSkills
        .filter(skill => skill.proficiency < 60)
        .map(skill => skill.skillId),
      recommendations,
      overallScore: Math.round(averageProficiency)
    } as AssessmentResult;
  } catch (error) {
    throw handleApiError(error);
  }
};

// API service exports
export const apiService: ApiTypes = {
  api: db,
  functions: {
    fetchSkills,
    fetchSkillCategories,
    getUserSkills,
    updateUserSkill,
    startAssessment,
  }
};

export default apiService;
