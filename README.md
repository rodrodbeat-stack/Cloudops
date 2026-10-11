# NEXUS // Control Plane

Dashboard web de demostración para Governance, Security, CI/CD, Git Graph, Infrastructure y Audit Logs.

## Ejecutar localmente
1. Descomprime el ZIP.
2. Abre `index.html` en un navegador moderno.

También puedes publicar el contenido en GitHub Pages:
1. Sube `index.html`, `styles.css` y `app.js` a la raíz del repositorio.
2. En GitHub, entra a **Settings → Pages**.
3. Selecciona la rama principal y la carpeta `/ (root)`.
4. Guarda y espera la publicación.

## Funciones incluidas
- Navegación entre dashboards independientes.
- Selector de entorno PROD / STAGING / DEV.
- Git Graph con filtro de ramas y tabla de commits de demostración.
- Panels de Governance, Security, CI/CD e Infrastructure.
- Live Warnings interactivos.
- Audit Logs con filtros y exportación CSV.
- Asistente simulado para preguntas de estado.
- Diseño responsive para escritorio, tablet y móvil.

## Importante
Todos los datos, commits, alertas, métricas y estados son **datos de demostración**. No se conecta a AWS, Azure, GCP, GitHub ni herramientas de observabilidad. Para producción se requiere integrar APIs reales, autenticación, control de acceso y un backend seguro. No pongas credenciales ni secretos en el frontend.
