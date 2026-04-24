# Sistema de Gestión de Tutorías - Frontend

Este proyecto corresponde a la interfaz de usuario para el Sistema de Gestión de Tutorías. Ha sido desarrollado utilizando React y Vite, implementando un diseño moderno, dinámico y responsivo para los diferentes roles del sistema (Estudiante, Docente y Tutor).

## Requisitos Previos

Para poder ejecutar este entorno de manera local, es indispensable contar con:
- Node.js (versión 16.x o superior)
- Tener el proyecto Backend ejecutándose en paralelo.

## Instalación

1. Navegue al directorio raíz del frontend (`tutorias`) y ejecute el siguiente comando para instalar todas las dependencias:
```bash
npm install
```

## Ejecución del Proyecto

Para iniciar el servidor de desarrollo utilizando Vite, ejecute el comando:
```bash
npm run dev
```
La aplicación web se compilará y abrirá un servidor local (típicamente en `http://localhost:5173` o el puerto que Vite asigne).

## Consideraciones de Red
Este cliente React está configurado para consumir los datos a través de una API REST. Todas las peticiones asíncronas (`fetch`) apuntan por defecto hacia `http://localhost:3001/api`. Si su backend se encuentra alojado en otro puerto, será necesario actualizar las URL de consulta dentro de los archivos ubicados en la carpeta `src/data/database.js` y `src/context/`.

## Librerías y Herramientas Principales Utilizadas
- react & react-dom: Librería base para la construcción de componentes y renderizado.
- react-router-dom: Implementado para la navegación entre distintas vistas (Inicio, Perfil, Reportes) de manera transparente para el usuario (Single Page Application).
- tailwindcss: Entorno de trabajo para diseñar la aplicación sin salir de los archivos JSX, brindando estilos de manera rápida y mantenible.
- framer-motion: Librería responsable de todas las animaciones, transiciones suaves y efectos visuales de los elementos de la página.
- lucide-react: Paquete utilizado para integrar la iconografía consistente del sistema.
- html2pdf.js: Utilizado dentro del flujo de reportes para exportar evaluaciones grupales y formatos estructurados directamente a un documento PDF.
