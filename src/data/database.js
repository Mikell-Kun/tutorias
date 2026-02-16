// Mock database mirroring the SQL tables with expanded rol
export const Estudiantes = [
    {
        n_control: 20491199,
        nombre_completo: 'Gabriel Miguel Cabrera Samano',
        fecha_nacimiento: '2002-09-15',
        telefono: '686-315-1314',
        carrera: 'Ingeniería en Sistemas computacionales',
        semestre: '7mo Semestre',
        estatus: 'Regular',
        rol: 'estudiante',
        correo: 'a20491199@gmail.com',
        tutor_id: 20202020
    },
    {
        n_control: 20491198,
        nombre_completo: 'Juan Perez',
        fecha_nacimiento: '2001-05-20',
        telefono: '686-123-4567',
        carrera: 'Ingeniería en Sistemas computacionales',
        semestre: '5to Semestre',
        estatus: 'Regular',
        rol: 'estudiante',
        correo: 'a20491198@itmexicali.edu.mx',
        tutor_id: 20202020
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
        id_tutor: 20202020,
        nombre_completo: 'Ing. Roberto Mendez',
        telefono: '686-333-4455',
        rol: 'tutor',
        correo: 'roberto.mendez@itmexicali.edu.mx'
    }
];

export const TutoresAuth = [
    { id_tutor: 20202020, contrasena: 'Tutor123' }
];

export const EstudiantesAuth = [
    { n_control: 20491199, contrasena: 'Gatitofeliz3' },
    { n_control: 20491198, contrasena: 'Pepito12' },
    { n_control: 10101010, contrasena: 'Docente123' }
];

/**
 * Validates credentials against all simulated context tables
 */
export const validateCredentials = (nControl, password) => {
    const controlNum = parseInt(nControl, 10);

    // Check EstudiantesAuth (contains students and docentes for now in the mock)
    let authEntry = EstudiantesAuth.find(
        auth => auth.n_control === controlNum && auth.contrasena === password
    );

    if (authEntry) {
        return (
            Estudiantes.find(u => u.n_control === controlNum) ||
            Docentes.find(u => u.n_control === controlNum)
        );
    }

    // Check TutoresAuth
    authEntry = TutoresAuth.find(
        auth => auth.id_tutor === controlNum && auth.contrasena === password
    );

    if (authEntry) {
        return Tutores.find(u => u.id_tutor === controlNum);
    }

    return null;
};

export const Incidencias = [
    {
        id: 1,
        estudiante_n_control: 20491198, // Juan Perez
        estudiante_nombre: 'Juan Pérez García',
        estudiante_carrera: 'Ingeniería en Sistemas Computacionales',
        tipo: 'INASISTENCIA',
        descripcion: 'Acumuló 6 inasistencias sin justificar',
        materia_codigo: 'PRO101',
        materia_nombre: 'Fundamentos de Programación',
        docente_nombre: 'Prof. Ana Martinez',
        fecha_hora: '27 de enero de 2026, 10:04 a.m.',
        tutor_id: 20202020
    }
];
