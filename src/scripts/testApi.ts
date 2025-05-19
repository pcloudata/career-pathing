import { apiService } from '../services/api';
import { Skill, SkillCategory, UserSkill, AssessmentResult } from '../types';

async function testSkills() {
  try {
    console.log('Testing fetchSkills...');
    const skills = await apiService.functions.fetchSkills();
    console.log('Skills:', skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
  }
}

async function testSkillCategories() {
  try {
    console.log('Testing fetchSkillCategories...');
    const categories = await apiService.functions.fetchSkillCategories();
    console.log('Skill categories:', categories);
  } catch (error) {
    console.error('Error fetching skill categories:', error);
  }
}

async function testUserSkills() {
  try {
    console.log('Testing getUserSkills...');
    const userSkills = await apiService.functions.getUserSkills('1');
    console.log('User skills:', userSkills);
  } catch (error) {
    console.error('Error fetching user skills:', error);
  }
}

async function testUpdateSkill() {
  try {
    console.log('Testing updateUserSkill...');
    const updatedSkill = await apiService.functions.updateUserSkill('1', '1', 90);
    console.log('Updated skill:', updatedSkill);
  } catch (error) {
    console.error('Error updating skill:', error);
  }
}

async function testAssessment() {
  try {
    console.log('Testing startAssessment...');
    const result = await apiService.functions.startAssessment('1', ['1', '2']);
    console.log('Assessment result:', result);
  } catch (error) {
    console.error('Error starting assessment:', error);
  }
}

async function main() {
  console.log('Running API tests...');
  await testSkills();
  await testSkillCategories();
  await testUserSkills();
  await testUpdateSkill();
  await testAssessment();
  console.log('All tests completed');
}

main().catch(console.error);
