import React from 'react';
import logo from './logo.svg';
import './App.css';
import { SkillAssessmentProvider } from './context/SkillAssessmentContext';
import SkillAssessment from './components/SkillAssessment';
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
        </main>
      </div>
    </SkillAssessmentProvider>
  );
}

export default App;
