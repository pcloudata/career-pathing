import React from 'react';
import { useSkillAssessment } from '../context/SkillAssessmentContext';

const SkillAssessmentTest: React.FC = () => {
  const {
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
  } = useSkillAssessment();

  const handleAssess = async () => {
    if (selectedSkills.length > 0) {
      await assessSkills(selectedSkills);
    }
  };

  const handleUpdateProficiency = async (skillId: string, proficiency: number) => {
    await updateSkillProficiency(skillId, proficiency);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Skill Assessment Test</h2>

      <button onClick={loadSkills} disabled={loading}>
        {loading ? 'Loading...' : 'Load Skills'}
      </button>
      <button onClick={loadSkillCategories} disabled={loading}>
        {loading ? 'Loading...' : 'Load Skill Categories'}
      </button>

      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {error.message}
        </div>
      )}

      <h3>Skills</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {skills.map((skill) => (
          <div
            key={skill.id}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              background: selectedSkills.includes(skill.id) ? '#e3f2fd' : 'white'
            }}
            onClick={() => {
              if (selectedSkills.includes(skill.id)) {
                deselectSkill(skill.id);
              } else {
                selectSkill(skill.id);
              }
            }}
          >
            {skill.name}
          </div>
        ))}
      </div>

      <h3>User Skills</h3>
      <div style={{ margin: '20px 0' }}>
        {userSkills.map((skill) => (
          <div key={skill.skillId} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ddd' }}>
            <div>{skill.skillId}</div>
            <div>Proficiency: {skill.proficiency}</div>
            <button
              onClick={() => handleUpdateProficiency(skill.skillId, skill.proficiency + 10)}
              disabled={skill.proficiency >= 100}
            >
              Increase Proficiency
            </button>
          </div>
        ))}
      </div>

      <h3>Selected Skills</h3>
      <div style={{ margin: '20px 0' }}>
        {selectedSkills.map((skillId) => (
          <div key={skillId} style={{ margin: '5px 0' }}>{skillId}</div>
        ))}
      </div>

      <button onClick={handleAssess} disabled={loading || selectedSkills.length === 0}>
        {loading ? 'Assessing...' : 'Assess Selected Skills'}
      </button>

      <h3>Assessment Result</h3>
      {assessmentResult && (
        <div style={{ padding: '10px', border: '1px solid #ddd' }}>
          <div>Overall Score: {assessmentResult.overallScore}</div>
          <div><strong>Strengths:</strong> {assessmentResult.strengths.join(', ')}</div>
          <div><strong>Weaknesses:</strong> {assessmentResult.weaknesses.join(', ')}</div>
          <div><strong>Recommendations:</strong></div>
          <ul>
            {assessmentResult.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
          <button onClick={clearAssessment}>Clear Assessment</button>
        </div>
      )}
    </div>
  );
};

export default SkillAssessmentTest;
