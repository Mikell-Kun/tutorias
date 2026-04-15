# Sistema de Tutorías

Este es un sistema web para la gestión de tutorías y reporte de atención a estudiantes, diseñado con una interfaz moderna y funcionalidades de generación de reportes automáticos en PDF.

## 🛠️ Herramientas Principales Utilizadas

El proyecto está construido bajo un entorno de desarrollo web moderno:

* **[React](https://react.dev/)**: Biblioteca principal para la construcción de interfaces de usuario.
* **[Vite](https://vitejs.dev/)**: Entorno de desarrollo ultrarrápido y empaquetador web.
* **[Tailwind CSS](https://tailwindcss.com/)**: Framework de CSS para la creación de un diseño rápido, escalable y adaptable (responsive).
* **[React Router DOM](https://reactrouter.com/)**: Encargado del manejo de la navegación entre las distintas secciones del sistema (Dashboard, Reportes, Historial, Mensajería, etc.).
* **[jsPDF](https://artskydj.github.io/jsPDF/docs/jsPDF.html) y [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)**: Herramientas utilizadas para generar y dar esquema a reportes semestrales y por estudiante nativamente hacia formato PDF.
* **[Framer Motion](https://www.framer.com/motion/)**: Para agregar transiciones fluidas y animaciones interactivas a la interfaz.
* **[Lucide React](https://lucide.dev/)**: Colección de iconos modernos y consistentes.

## 📋 Requisitos Previos

Para poder levantar este proyecto en tu computadora de manera local, necesitas lo siguiente:

* **[Node.js](https://nodejs.org/es)** (Se recomienda usar una versión LTS, como v18 o v20 o posterior). Instalar Node.js también instala la herramienta `npm`.
* Un editor de código, como [Visual Studio Code](https://code.visualstudio.com/).

## 🚀 Cómo inicializar y ejecutar el proyecto localmente

Sigue estos pasos en tu terminal (o consola de comandos de tu editor de código):

1. **Abre una terminal** asegurándote de que la ruta apunte a la carpeta raíz de este proyecto (donde se encuentra este archivo `README.md`).
2. **Instala las dependencias necesarias**. Ejecuta el siguiente comando para que NPM descargue todas las librerías mencionadas:
   ```bash
   npm install
   ```
3. **Inicia el servidor de desarrollo**. Una vez finalizada la instalación, ejecuta el proyecto usando:
   ```bash
   npm run dev
   ```
4. **Abre el proyecto en tu navegador**. El comando anterior te mostrará en la terminal una URL local (usualmente algo como `http://localhost:5173/`). Puedes copiar y pegar esa url en Chrome, Edge o Firefox, o hacer "Ctrl + clic" para abrir el sistema directamente.

## 💡 Notas sobre el uso de la plataforma

El sistema actualmente opera utilizando un ambiente de persistencia temporal simulado en memoria y empleando el `localStorage` de tu navegador (`src/data/database.js`).

* **Inicio de Sesión:** Al abrir el proyecto te encontrarás con una pantalla de Login. Puedes emplear cualquiera de los usuarios de prueba definidos en el código.
  * **Tutor de prueba:** Usuario `20202020` / Contraseña `Tutor123`
  * **Docente de prueba:** Usuario `10101010` / Contraseña `Docente123`
  * **Estudiante de prueba:** Usuario `20491199` / Contraseña `Gatitofeliz3`
* **Generación de Reportes:** Cuando un usuario Tutor inicia sesión, puede generar reportes y el sistema automáticamente le descargará en su computadora el archivo `.pdf` con los datos suministrados. Al hacer esto el reporte aparecerá también en la pestaña de Historial Reportes.
