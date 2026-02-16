import React, { useState, useEffect } from 'react';
import { useUser } from './context/UserContext';
import Home from './views/student/Home';
import Reticula from './views/student/Reticula';
import Profile from './views/student/Profile';
import Messages from './views/student/Messages';
import TeacherHome from './views/teacher/Home';
import TutorHome from './views/tutor/Home';
import DashboardLayout from './components/DashboardLayout';
import Login from './views/Login';
import './App.css';

function App() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('home');

  if (!user) {
    return <Login />;
  }

  // Define Content based on Role and Tab
  const renderContent = () => {
    if (user.role === 'student') {
      switch (activeTab) {
        case 'home': return <Home user={user} />;
        case 'reticula': return <Reticula user={user} />;
        case 'profile': return <Profile user={user} />;
        case 'messages': return <Messages />;
        default: return <Home user={user} />;
      }
    }

    if (user.role === 'teacher') {
      switch (activeTab) {
        case 'home': return <TeacherHome user={user} />;
        case 'students':
        case 'sessions':
        case 'reports':
          return (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <h2 className="gradient-text">Vista {activeTab.toUpperCase()}</h2>
              <p style={{ color: 'var(--text-dim)', marginTop: '10px' }}>Esta funcionalidad para Docentes se implementará en el siguiente paso.</p>
            </div>
          );
        default: return <TeacherHome user={user} />;
      }
    }

    if (user.role === 'tutor') {
      switch (activeTab) {
        case 'home': return <TutorHome user={user} />;
        case 'groups':
        case 'stats':
        case 'messages':
          return (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <h2 className="gradient-text">Vista {activeTab.toUpperCase()}</h2>
              <p style={{ color: 'var(--text-dim)', marginTop: '10px' }}>Esta funcionalidad para Tutores de Área se implementará en el siguiente paso.</p>
            </div>
          );
        default: return <TutorHome user={user} />;
      }
    }

    return <div>Role not recognized</div>;
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div key={`${user.role}-${activeTab}`}>
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}

export default App;
