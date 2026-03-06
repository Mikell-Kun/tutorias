import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Login from './views/Login.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import StudentHome from './views/student/Home.jsx';
import TeacherHome from './views/docentes/Home.jsx';
import ReportarIncidencia from './views/docentes/ReportarIncidencia.jsx';
import Profile from './views/student/Profile.jsx';
import Messages from './views/Messages.jsx';
import {
  ReticulaPlaceholder
} from './views/Placeholders.jsx';
import TutorHome from './views/tutor/Home.jsx';
import TutorIncidencias from './views/tutor/Incidencias.jsx';
import MisEstudiantes from './views/tutor/MisEstudiantes.jsx';
import TutorReportes from './views/tutor/Reportes.jsx';

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
              user?.role === 'tutor' ? <TutorHome /> :
                <StudentHome />
          } />

          {/* Sub Routes */}
          <Route path="reticula" element={<ReticulaPlaceholder />} />
          <Route path="perfil" element={<Profile role="student" />} />
          <Route path="mensajes" element={<Messages />} />
          <Route path="/reportes" element={<TutorReportes />} />
          <Route path="/incidencias" element={<TutorIncidencias />} />
          <Route path="/reportar-incidencia" element={<ReportarIncidencia />} />
          <Route path="/students" element={
            user?.role === 'tutor' ? <MisEstudiantes /> :
              <div className="p-8">Sección de Estudiantes (Docente - Próximamente)</div>
          } />
          <Route path="/events" element={<div className="p-8">Sección de Eventos (Próximamente)</div>} />
          <Route path="/settings" element={<div className="p-8">Configuración</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
