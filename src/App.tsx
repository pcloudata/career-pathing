import React from 'react';
import logo from './logo.svg';
import './App.css';
import { SkillAssessmentProvider } from './context/SkillAssessmentContext';
import SkillAssessment from './components/SkillAssessment';
import SkillAssessmentTest from './components/SkillAssessmentTest';
import './components/SkillAssessment.css';

function App() {
  return (
    <SkillAssessmentProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Career Pathing Platform</h1>
        </header>
        <main>
          <SkillAssessment />
          <hr />
          <h2>Test Interface</h2>
          <SkillAssessmentTest />
        </main>
      </div>
    </SkillAssessmentProvider>
  );
}

export default App;
