// Mock database mirroring the SQL tables with expanded roles

export const Estudiantes = [
    {
        n_control: 20491199,
        nombre_completo: 'Gabriel Miguel Cabrera Samano',
        fecha_nacimiento: '2002-09-15',
        telefono: '686-315-1314',
        carrera: 'Ingeniería en Sistemas computacionales',
        rol: 'estudiante',
        correo: 'a20491199@gmail.com'
    },
    {
        n_control: 20491198,
        nombre_completo: 'Juan Perez',
        fecha_nacimiento: '2001-05-20',
        telefono: '686-123-4567',
        carrera: 'Ingeniería en Sistemas computacionales',
        rol: 'estudiante',
        correo: 'a20491198@itmexicali.edu.mx'
    }
];

// Additional roles for simulation
export const Docentes = [
    {
        n_control: 10101010,
        nombre_completo: 'Dra. Elena Rodriguez',
        rol: 'docente',
        departamento: 'Ciencias de la Computación'
    }
];

export const Tutores = [
    {
        n_control: 20202020,
        nombre_completo: 'Ing. Roberto Mendez',
        rol: 'tutor',
        area: 'Tutorías Académicas'
    }
];

export const EstudiantesAuth = [
    { n_control: 20491199, contrasena: 'Gatitofe' },
    { n_control: 20491198, contrasena: 'Pepito12' },
    { n_control: 10101010, contrasena: 'Docente123' },
    { n_control: 20202020, contrasena: 'Tutor123' }
];

/**
 * Validates credentials against all simulated context tables
 */
export const validateCredentials = (nControl, password) => {
    const controlNum = parseInt(nControl, 10);

    const authEntry = EstudiantesAuth.find(
        auth => auth.n_control === controlNum && auth.contrasena === password
    );

    if (authEntry) {
        // Search in all role tables
        return (
            Estudiantes.find(u => u.n_control === controlNum) ||
            Docentes.find(u => u.n_control === controlNum) ||
            Tutores.find(u => u.n_control === controlNum)
        );
    }

    return null;
};
