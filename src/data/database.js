const API_URL = 'http://localhost:3001/api';

// ===== AUTENTICACIÓN Y USUARIOS =====

const mapRolToRole = (user) => {
    if (!user) return user;
    if (user.rol === 'estudiante') user.role = 'student';
    else if (user.rol === 'docente') user.role = 'teacher';
    else if (user.rol === 'tutor') user.role = 'tutor';
    return user;
};

export const validateCredentials = async (nControl, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nControl, password })
        });
        if (!response.ok) return null;
        let data = await response.json();
        return mapRolToRole(data);
    } catch (error) {
        console.error("Error validando credenciales:", error);
        return null;
    }
};

export const getUserByControl = async (control) => {
    if (!control) return null;
    try {
        const response = await fetch(`${API_URL}/usuarios/${control}`);
        if (!response.ok) return null;
        let data = await response.json();
        return mapRolToRole(data);
    } catch (error) {
        console.error("Error obteniendo usuario:", error);
        return null;
    }
};

export const updateUser = async (id, updatedData) => {
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        if (!response.ok) return false;
        return true;
    } catch (error) {
        console.error("Error actualizando usuario:", error);
        return false;
    }
};

export const getContactosDisponibles = async (user) => {
    if (!user) return [];
    try {
        const response = await fetch(`${API_URL}/usuarios/contactos?rol=${user.rol}`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Error obteniendo contactos:", error);
        return [];
    }
};

// ===== COLECCIONES PRINCIPALES =====

export const fetchEstudiantes = async () => {
    try {
        const res = await fetch(`${API_URL}/estudiantes`);
        return await res.json();
    } catch (error) { return []; }
};

export const fetchDocentes = async () => {
    try {
        const res = await fetch(`${API_URL}/docentes`);
        return await res.json();
    } catch (error) { return []; }
};

export const fetchTutores = async () => {
    try {
        const res = await fetch(`${API_URL}/tutores`);
        return await res.json();
    } catch (error) { return []; }
};

export const fetchMaterias = async () => {
    try {
        const res = await fetch(`${API_URL}/materias`);
        return await res.json();
    } catch (error) { return []; }
};

// ===== MENSAJERÍA =====

export const getMensajes = async (userId) => {
    if (!userId) return [];
    try {
        const response = await fetch(`${API_URL}/mensajes/${userId}`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) { return []; }
};

export const addMensaje = async (remitenteId, destinatarioId, contenido) => {
    try {
        const response = await fetch(`${API_URL}/mensajes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ remitenteId, destinatarioId, contenido })
        });
        const nuevo = await response.json();
        // Disparamos un evento para que las vistas se enteren (como antes)
        window.dispatchEvent(new CustomEvent('databaseUpdated'));
        return nuevo;
    } catch (error) {
        console.error("Error enviando mensaje:", error);
        return null;
    }
};

export const markMensajesComoLeidos = async (userId, contactId) => {
    try {
        await fetch(`${API_URL}/mensajes/leidos`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, contactId })
        });
        window.dispatchEvent(new CustomEvent('databaseUpdated'));
    } catch (error) {
        console.error("Error marcando como leídos:", error);
    }
};

// ===== INCIDENCIAS =====

export const getIncidencias = async () => {
    try {
        const response = await fetch(`${API_URL}/incidencias`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const addIncidencia = async (nuevaIncidencia) => {
    // nuevaIncidencia debe venir estructurada como:
    // { remitente_id, estudiante_relacionado, tipo, titulo, descripcion, datos }
    try {
        const response = await fetch(`${API_URL}/incidencias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaIncidencia)
        });
        window.dispatchEvent(new CustomEvent('databaseUpdated'));
        return await response.json();
    } catch (error) {
        console.error("Error creando incidencia", error);
        return null;
    }
};

export const markIncidenciaAsRead = async (id) => {
    try {
        await fetch(`${API_URL}/incidencias/${id}/leida`, { method: 'PUT' });
        window.dispatchEvent(new CustomEvent('databaseUpdated'));
    } catch (error) {
        console.error("Error marcando incidencia como leida", error);
    }
};
