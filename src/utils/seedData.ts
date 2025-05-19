import { db } from '../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Skill, SkillCategory, UserSkill } from '../types';

const seedSkills = async () => {
  const skills = [
    {
      name: 'JavaScript',
      category: 'Programming Languages',
      description: 'A programming language that is commonly used to create interactive effects within web browsers.',
      proficiencyLevels: [
        { level: 1, name: 'Beginner', description: 'Basic understanding of JavaScript syntax', criteria: ['Can write simple functions', 'Understands variables and control structures'] },
        { level: 2, name: 'Intermediate', description: 'Can create complex applications', criteria: ['Can use ES6+', 'Understands async operations'] },
        { level: 3, name: 'Advanced', description: 'Expert level knowledge', criteria: ['Can write complex algorithms', 'Understands performance optimization'] }
      ],
      relatedSkills: ['React', 'Node.js', 'TypeScript']
    },
    {
      name: 'React',
      category: 'Frontend Frameworks',
      description: 'A JavaScript library for building user interfaces.',
      proficiencyLevels: [
        { level: 1, name: 'Beginner', description: 'Basic understanding of React concepts', criteria: ['Can create simple components', 'Understands JSX'] },
        { level: 2, name: 'Intermediate', description: 'Can build complex applications', criteria: ['Understands hooks', 'Can use context'] },
        { level: 3, name: 'Advanced', description: 'Expert level knowledge', criteria: ['Can optimize performance', 'Understands advanced patterns'] }
      ],
      relatedSkills: ['JavaScript', 'TypeScript', 'Redux']
    },
    {
      name: 'Node.js',
      category: 'Backend Technologies',
      description: 'An open-source, cross-platform JavaScript runtime environment.',
      proficiencyLevels: [
        { level: 1, name: 'Beginner', description: 'Basic understanding of Node.js', criteria: ['Can write simple scripts', 'Understands npm'] },
        { level: 2, name: 'Intermediate', description: 'Can build complex applications', criteria: ['Can use async/await', 'Understands streams'] },
        { level: 3, name: 'Advanced', description: 'Expert level knowledge', criteria: ['Can optimize performance', 'Understands clustering'] }
      ],
      relatedSkills: ['JavaScript', 'Express', 'MongoDB']
    }
  ];

  const skillsRef = collection(db, 'skills');
  for (const skill of skills) {
    await addDoc(skillsRef, skill);
  }
  console.log('Skills seeded successfully');
};

const seedSkillCategories = async () => {
  const categories = [
    {
      name: 'Programming Languages',
      description: 'Programming languages and their related technologies',
      skills: ['JavaScript', 'TypeScript', 'Python', 'Java']
    },
    {
      name: 'Frontend Frameworks',
      description: 'Frontend development frameworks and libraries',
      skills: ['React', 'Vue.js', 'Angular']
    },
    {
      name: 'Backend Technologies',
      description: 'Backend development technologies and frameworks',
      skills: ['Node.js', 'Express', 'Django']
    }
  ];

  const categoriesRef = collection(db, 'skillCategories');
  for (const category of categories) {
    await addDoc(categoriesRef, category);
  }
  console.log('Skill categories seeded successfully');
};

const seedSampleUserSkills = async () => {
  const userSkills = [
    {
      userId: '1',
      skillId: '1',
      proficiency: 85,
      confidence: 0.9,
      lastAssessed: Timestamp.fromDate(new Date('2025-05-18')),
      lastUpdated: Timestamp.fromDate(new Date('2025-05-18'))
    },
    {
      userId: '1',
      skillId: '2',
      proficiency: 75,
      confidence: 0.8,
      lastAssessed: Timestamp.fromDate(new Date('2025-05-18')),
      lastUpdated: Timestamp.fromDate(new Date('2025-05-18'))
    },
    {
      userId: '1',
      skillId: '3',
      proficiency: 65,
      confidence: 0.7,
      lastAssessed: Timestamp.fromDate(new Date('2025-05-18')),
      lastUpdated: Timestamp.fromDate(new Date('2025-05-18'))
    }
  ];

  const userSkillsRef = collection(db, 'userSkills');
  for (const skill of userSkills) {
    await addDoc(userSkillsRef, skill);
  }
  console.log('User skills seeded successfully');
};

export const seedData = async () => {
  await seedSkills();
  await seedSkillCategories();
  await seedSampleUserSkills();
  console.log('All data seeded successfully');
};
