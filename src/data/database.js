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
        nombre_completo: 'Juan Garcia Perez',
        fecha_nacimiento: '2001-05-20',
        telefono: '686-123-4567',
        carrera: 'Ingeniería en Sistemas computacionales',
        semestre: '5to Semestre',
        estatus: 'Regular',
        rol: 'estudiante',
        correo: 'a20491198@itmexicali.edu.mx',
        tutor_id: 20202020
    },
    {
        n_control: 20491197,
        nombre_completo: 'Maria antonieta de las nieves',
        fecha_nacimiento: '2000-04-20',
        telefono: '686-123-4567',
        carrera: 'Ingeniería en Sistemas computacionales',
        semestre: '8to Semestre',
        estatus: 'Regular',
        rol: 'estudiante',
        correo: 'a20491198@itmexicali.edu.mx',
        tutor_id: 40404040
    },
    {
        n_control: 20491196,
        nombre_completo: 'Veronica citlali martinez lopez',
        fecha_nacimiento: '2000-04-20',
        telefono: '686-123-4567',
        carrera: 'Ingeniería en Sistemas computacionales',
        semestre: '4to Semestre',
        estatus: 'Regular',
        rol: 'estudiante',
        correo: 'a20491198@itmexicali.edu.mx',
        tutor_id: 40404040
    },
    {
        n_control: 20491195,
        nombre_completo: 'Jesus Alejandro Hernandez Lopez',
        fecha_nacimiento: '2000-04-20',
        telefono: '686-123-4567',
        carrera: 'Ingeniería en Sistemas computacionales',
        semestre: '2to Semestre',
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
        nombre_completo: 'Elena Rodriguez Gonzalez',
        rol: 'docente',
        departamento: 'Sistemas Computacionales',
        correo: 'elena.rodriguez@itmexicali.edu.mx',
        telefono: '686-111-2233'
    },
    {
        n_control: 30303030,
        nombre_completo: 'Ana Martinez Hernandez',
        rol: 'docente',
        departamento: 'Sistemas Computacionales',
        correo: 'ana.martinez@itmexicali.edu.mx',
        telefono: '686-444-5566'
    }
];

export const Materias = {
    'Sistemas Computacionales': [
        { codigo: 'ACF-0901', nombre: 'Cálculo Diferencial' },
        { codigo: 'SCD-1008', nombre: 'Fundamentos de Programación' },
        { codigo: 'ACA-0907', nombre: 'Taller de Ética' },
        { codigo: 'SCH-1024', nombre: 'Matemáticas Discretas' },
        { codigo: 'ACC-0906', nombre: 'Fundamentos de Investigación' },
        { codigo: 'ACF-0902', nombre: 'Cálculo Integral' },
        { codigo: 'SCD-1020', nombre: 'Programación Orientada a Objetos' },
        { codigo: 'AEC-1058', nombre: 'Química' },
        { codigo: 'ACF-0903', nombre: 'Algebra Lineal' },
        { codigo: 'AEF-1052', nombre: 'Probabilidad y Estadística' },
        { codigo: 'AED-1026', nombre: 'Estructura de Datos' },
        { codigo: 'SCD-1004', nombre: 'Programación Web' },
        { codigo: 'SCA-1001', nombre: 'Administración de Base de Datos' },
        { codigo: 'ISI-1704', nombre: 'Desarrollo de Aplicaciones Web' }
    ]
};

export const Tutores = [
    {
        id_tutor: 20202020,
        nombre_completo: 'Roberto Mendez Mendoza',
        telefono: '686-333-4455',
        rol: 'tutor',
        correo: 'roberto.mendez@itmexicali.edu.mx'
    },
    {
        id_tutor: 40404040,
        nombre_completo: 'Laura Garcia Lopez',
        telefono: '686-555-6677',
        rol: 'tutor',
        correo: 'laura.garcia@itmexicali.edu.mx'
    }
];

export const TutoresAuth = [
    { id_tutor: 20202020, contrasena: 'Tutor123' },
    { id_tutor: 40404040, contrasena: 'Tutor123' }
];

export const DocentesAuth = [
    { n_control: 10101010, contrasena: 'Docente123' },
    { n_control: 30303030, contrasena: 'Docente123' }
];

export const EstudiantesAuth = [
    { n_control: 20491199, contrasena: 'Gatitofeliz3' },
    { n_control: 20491198, contrasena: '123456' },
    { n_control: 20491197, contrasena: '123456' },
    { n_control: 20491196, contrasena: '123456' },
    { n_control: 20491195, contrasena: '123456' }
];

/**
 * Validates credentials against all simulated context tables
 */
export const validateCredentials = (nControl, password) => {
    const controlNum = parseInt(nControl, 10);

    // Check EstudiantesAuth
    let authEntry = EstudiantesAuth.find(
        auth => auth.n_control === controlNum && auth.contrasena === password
    );
    if (authEntry) return Estudiantes.find(u => u.n_control === controlNum);

    // Check DocentesAuth
    authEntry = DocentesAuth.find(
        auth => auth.n_control === controlNum && auth.contrasena === password
    );
    if (authEntry) return Docentes.find(u => u.n_control === controlNum);

    // Check TutoresAuth
    authEntry = TutoresAuth.find(
        auth => auth.id_tutor === controlNum && auth.contrasena === password
    );
    if (authEntry) return Tutores.find(u => u.id_tutor === controlNum);

    return null;
};

// Keys for localStorage
const STORAGE_KEY_INCIDENCIAS = 'tutorias_incidencias_db';
const STORAGE_KEY_MENSAJES = 'tutorias_mensajes_db';

// Initial data for incidences (pre-populated)
const initialIncidencias = [
    {
        id: 1,
        estudiante_n_control: 20491198, // Juan Perez
        estudiante_nombre: 'Juan Pérez García',
        estudiante_carrera: 'Ingeniería en Sistemas Computacionales',
        tipo: 'Retardos o ausencias injustificadas',
        descripcion: 'Acumuló 6 inasistencias sin justificar',
        materia_codigo: 'SCD-1008',
        materia_nombre: 'Fundamentos de Programación',
        docente_nombre: 'Ana Martinez Hernandez',
        fecha_hora: '27 de enero de 2026, 10:04 a.m.',
        tutor_id: 20202020,
        leida: false
    }
];

// Helper to load from storage or use defaults
const getPersistentData = (key, fallback) => {
    const saved = localStorage.getItem(key);
    if (!saved) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
    }
    return JSON.parse(saved);
};

// Use a local variable to simulate a database that can be updated in-memory
let incidenciasData = getPersistentData(STORAGE_KEY_INCIDENCIAS, initialIncidencias);

// --- Messaging System ---
let mensajeriaData = getPersistentData(STORAGE_KEY_MENSAJES, []);

export const getMensajes = (userId) => {
    if (!userId) return [];
    const id = parseInt(userId, 10);
    // Always get fresh data from storage to ensure sync
    const currentData = getPersistentData(STORAGE_KEY_MENSAJES, []);
    return currentData.filter(m =>
        parseInt(m.remitente_id, 10) === id ||
        parseInt(m.destinatario_id, 10) === id
    );
};

export const addMensaje = (remitenteId, destinatarioId, contenido) => {
    const nuevo = {
        id: mensajeriaData.length + 1,
        remitente_id: parseInt(remitenteId, 10),
        destinatario_id: parseInt(destinatarioId, 10),
        contenido,
        fecha_hora: new Date().toLocaleString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }),
        leido: false
    };
    mensajeriaData = [...mensajeriaData, nuevo];
    localStorage.setItem(STORAGE_KEY_MENSAJES, JSON.stringify(mensajeriaData));
    window.dispatchEvent(new CustomEvent('databaseUpdated'));
    return nuevo;
};

export const markMensajesComoLeidos = (userId, contactId) => {
    const uId = parseInt(userId, 10);
    const cId = parseInt(contactId, 10);

    let changed = false;
    const updatedData = mensajeriaData.map(m => {
        if (parseInt(m.destinatario_id, 10) === uId && parseInt(m.remitente_id, 10) === cId && !m.leido) {
            changed = true;
            return { ...m, leido: true };
        }
        return m;
    });

    if (changed) {
        mensajeriaData = updatedData;
        localStorage.setItem(STORAGE_KEY_MENSAJES, JSON.stringify(mensajeriaData));
        window.dispatchEvent(new CustomEvent('databaseUpdated'));
    }
};

export const getContactosDisponibles = (user) => {
    if (!user) return [];

    // Tutors can see everyone
    if (user.rol === 'tutor') {
        return [
            ...Estudiantes.map(e => ({ ...e, id: e.n_control, tipo: 'Estudiante' })),
            ...Docentes.map(d => ({ ...d, id: d.n_control, tipo: 'Docente' }))
        ];
    }

    // Students and Teachers can only see Tutors
    if (user.rol === 'estudiante' || user.rol === 'docente') {
        return Tutores.map(t => ({ ...t, id: t.id_tutor, tipo: 'Tutor' }));
    }

    return [];
};

export const getIncidencias = () => getPersistentData(STORAGE_KEY_INCIDENCIAS, initialIncidencias);

export const addIncidencia = (nuevaIncidencia) => {
    const id = incidenciasData.length > 0 ? Math.max(...incidenciasData.map(i => i.id)) + 1 : 1;
    incidenciasData = [...incidenciasData, { ...nuevaIncidencia, id, leida: false, fecha_hora: new Date().toLocaleString('es-MX') }];

    localStorage.setItem(STORAGE_KEY_INCIDENCIAS, JSON.stringify(incidenciasData));
    // Notify components of data change
    window.dispatchEvent(new CustomEvent('databaseUpdated'));
    return incidenciasData;
};

export const markIncidenciaAsRead = (id) => {
    incidenciasData = incidenciasData.map(i => i.id === id ? { ...i, leida: true } : i);

    localStorage.setItem(STORAGE_KEY_INCIDENCIAS, JSON.stringify(incidenciasData));
    // Notify components of data change
    window.dispatchEvent(new CustomEvent('databaseUpdated'));
    return incidenciasData;
};

export const Incidencias = incidenciasData;

export const getUserByControl = (control) => {
    if (!control) return null;
    const controlNum = parseInt(control, 10);
    return Estudiantes.find(e => e.n_control === controlNum) ||
        Docentes.find(d => d.n_control === controlNum) ||
        Tutores.find(t => t.id_tutor === controlNum);
};

