import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Login from './views/Login.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import StudentHome from './views/student/Home.jsx';
import TeacherHome from './views/teacher/Home.jsx';
import {
  ReticulaPlaceholder,
  ProfilePlaceholder,
  MessagesPlaceholder
} from './views/Placeholders.jsx';

function App() {
  const { user, loading } = useUser();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh">
      <div className="w-12 h-12 border-4 border-navy border-t-gold rounded-full animate-spin"></div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

        <Route element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
          {/* Shared/Switching Home Path */}
          <Route path="/" element={
            user?.role === 'teacher' ? <TeacherHome /> :
              user?.role === 'tutor' ? <div className="p-8">Panel del Tutor (En desarrollo)</div> :
                <StudentHome />
          } />

          {/* Sub Routes */}
          <Route path="/reticula" element={<ReticulaPlaceholder />} />
          <Route path="/profile" element={<ProfilePlaceholder />} />
          <Route path="/messages" element={<MessagesPlaceholder />} />
          <Route path="/settings" element={<div className="p-8">Configuración</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
