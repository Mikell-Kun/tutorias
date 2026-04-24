const fs = require('fs');
const path = require('path');

const formsPath = 'c:/Users/migue/OneDrive/Escritorio/New folder/tutorias/src/views/tutor/';
const files = [
  'FormularioReporteSemestralIncidencias.jsx',
  'FormularioReporteIncidenciasDetallado.jsx',
  'FormularioReporteGrupalSemestral.jsx',
  'FormularioReporteGrupalDetallado.jsx',
  'FormularioReporteEstudianteSemestral.jsx',
  'FormularioReporteEstudianteDetallado.jsx'
];

files.forEach(file => {
  const filePath = path.join(formsPath, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace direct database import for fetchEstudiantes
  // import { Estudiantes } from '../../data/database'; -> import { fetchEstudiantes } from '../../data/database';
  content = content.replace(/import\s*\{\s*Estudiantes\s*\}\s*from\s*['"](\.\.\/\.\.\/data\/database(\.js)?)['"];?/, 
      "import { fetchEstudiantes } from '../../data/database.js';");
      
  // if Estudiantes was part of a larger destructured import like import { Estudiantes, getIncidencias } ...
  content = content.replace(/import\s*\{(.*?)\}\s*from\s*['"]\.\.\/\.\.\/data\/database(\.js)?['"];?/g, (match, p1) => {
      let vars = p1.split(',').map(s => s.trim());
      if (vars.includes('Estudiantes')) {
          vars = vars.filter(v => v !== 'Estudiantes');
          if (!vars.includes('fetchEstudiantes')) vars.push('fetchEstudiantes');
          return `import { ${vars.join(', ')} } from '../../data/database.js';`;
      }
      return match;
  });

  // Inject state
  const componentNameMatch = content.match(/const\s+(Formulario.*?)\s*=\s*\(\)\s*=>\s*\{/);
  if (componentNameMatch) {
    const compDeclStr = componentNameMatch[0];
    const hookInject = `\n    const [Estudiantes, setEstudiantes] = useState([]);\n    useEffect(() => { fetchEstudiantes().then(setEstudiantes); }, []);`;
    
    // Only inject if it's not already there
    if (!content.includes('const [Estudiantes, setEstudiantes] = useState([]);')) {
      content = content.replace(compDeclStr, compDeclStr + hookInject);
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Processed ' + file);
});
