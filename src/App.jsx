import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/ContextoUsuario';
import IniciarSesion from './views/IniciarSesion.jsx';
import EstructuraPrincipal from './components/EstructuraPrincipal.jsx';
import StudentHome from './views/student/Home.jsx';
import TeacherHome from './views/docentes/Home.jsx';
import ReportarIncidencia from './views/docentes/ReportarIncidencia.jsx';
import Perfil from './views/student/Perfil.jsx';
import Mensajes from './views/Mensajes.jsx';
import {
  ReticulaPlaceholder
} from './views/VistasTemporales.jsx';
import TutorHome from './views/tutor/Home.jsx';
import TutorIncidencias from './views/tutor/Incidencias.jsx';
import MisEstudiantes from './views/tutor/MisEstudiantes.jsx';
import TutorReportes from './views/tutor/Reportes.jsx';
import FormularioReporteGrupalSemestral from './views/tutor/FormularioReporteGrupalSemestral.jsx';
import FormularioReporteGrupalDetallado from './views/tutor/FormularioReporteGrupalDetallado.jsx';
import FormularioReporteCanalizacion from './views/tutor/FormularioReporteCanalizacion.jsx';
import FormularioReporteEstudianteSemestral from './views/tutor/FormularioReporteEstudianteSemestral.jsx';
import FormularioReporteEstudianteDetallado from './views/tutor/FormularioReporteEstudianteDetallado.jsx';
import FormularioReporteSemestralIncidencias from './views/tutor/FormularioReporteSemestralIncidencias.jsx';
import FormularioReporteIncidenciasDetallado from './views/tutor/FormularioReporteIncidenciasDetallado.jsx';
import DocumentacionReportes from './views/tutor/DocumentacionReportes.jsx';


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
        <Route path="/login" element={!user ? <IniciarSesion /> : <Navigate to="/" />} />

        <Route path="/" element={user ? <EstructuraPrincipal /> : <Navigate to="/login" />}>
          {/* Shared/Switching Home Path */}
          <Route index element={
            user?.role === 'teacher' ? <TeacherHome /> :
              user?.role === 'tutor' ? <TutorHome /> :
                <StudentHome />
          } />

          {/* Sub Routes */}
          <Route path="reticula" element={<ReticulaPlaceholder />} />
          <Route path="perfil" element={<Perfil role="student" />} />
          <Route path="mensajes" element={<Mensajes />} />
          <Route path="reportes" element={<TutorReportes />} />
          <Route path="reporte-grupal" element={<FormularioReporteGrupalSemestral />} />
          <Route path="reporte-detallado" element={<FormularioReporteGrupalDetallado />} />
          <Route path="reporte-canalizaciones" element={<FormularioReporteCanalizacion />} />
          <Route path="reporte-alumno" element={<FormularioReporteEstudianteSemestral />} />
          <Route path="reporte-detallado-alumno" element={<FormularioReporteEstudianteDetallado />} />
          <Route path="reporte-incidencia" element={<FormularioReporteSemestralIncidencias />} />
          <Route path="reporte-detallado-incidencia" element={<FormularioReporteIncidenciasDetallado />} />
          <Route path="reportes/documentacion" element={<DocumentacionReportes />} />

          <Route path="incidencias" element={<TutorIncidencias />} />
          <Route path="reportar-incidencia" element={<ReportarIncidencia />} />
          <Route path="students" element={
            (user?.role === 'tutor' || user?.role === 'teacher') ? <MisEstudiantes /> :
              <div className="p-8">Sección de Estudiantes (Próximamente)</div>
          } />
          <Route path="events" element={<div className="p-8">Sección de Eventos (Próximamente)</div>} />
          <Route path="settings" element={<div className="p-8">Configuración</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
