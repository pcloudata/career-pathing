import React from 'react';
import { useSkillAssessment } from '../context/SkillAssessmentContext';
import { Skill, UserSkill } from '../types/skill';

interface SkillAssessmentProps {
  onAssessmentComplete?: (result: any) => void;
}

const SkillAssessment: React.FC<SkillAssessmentProps> = ({ onAssessmentComplete }) => {
  const { 
    skills, 
    userSkills, 
    updateSkillProficiency,
    selectedSkills,
    handleSkillSelect,
    startAssessment
  } = useSkillAssessment();
  const [showAssessment, setShowAssessment] = React.useState(false);

  const handleProficiencyChange = (skillId: string, proficiency: number) => {
    updateSkillProficiency(skillId, proficiency);
  };

  const handleAssessmentStart = () => {
    if (selectedSkills.length === 0) {
      alert('Please select at least one skill to assess');
      return;
    }
    setShowAssessment(true);
    startAssessment();
  };

  const renderSkillCard = (skill: Skill) => {
    const userSkill = userSkills.find(s => s.skillId === skill.id);
    return (
      <div key={skill.id} className="skill-card">
        <div className="skill-header">
          <input
            type="checkbox"
            checked={selectedSkills.includes(skill.id)}
            onChange={() => handleSkillSelect(skill.id)}
          />
          <h3>{skill.name}</h3>
        </div>
        <p>{skill.description}</p>
        <div className="proficiency-levels">
          {skill.proficiencyLevels.map(level => {
            const isSelected = userSkill?.proficiency === level.level;
            return (
              <button
                key={level.level}
                onClick={() => handleProficiencyChange(skill.id, level.level)}
                className={`proficiency-btn level-${level.level} ${isSelected ? 'selected' : ''}`}
                title={level.description}
              >
                {level.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="skill-assessment">
      <h2>Skill Assessment</h2>
      
      {!showAssessment ? (
        <div className="skill-selection">
          <p>Select the skills you want to assess:</p>
          <div className="skill-grid">
            {skills.map(renderSkillCard)}
          </div>
          <button onClick={startAssessment} className="start-assessment-btn">
            Start Assessment
          </button>
        </div>
      ) : (
        <div className="assessment-view">
          <h3>Selected Skills Assessment</h3>
          <div className="selected-skills">
            {selectedSkills.map(skillId => {
              const skill = skills.find(s => s.id === skillId);
              const userSkill = userSkills.find(s => s.skillId === skillId);
              return skill && userSkill ? (
                <div key={skillId} className="selected-skill">
                  <h4>{skill.name}</h4>
                  <p>Proficiency: {skill.proficiencyLevels[userSkill.proficiency - 1].name}</p>
                </div>
              ) : null;
            })}
          </div>
          <button onClick={() => setShowAssessment(false)} className="back-btn">
            Back to Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillAssessment;
