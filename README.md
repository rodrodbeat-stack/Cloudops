# NEXUS // Control Plane — v2

Dashboard frontend inspirado en GitKraken + observabilidad estilo Datadog, con Governance, Security, CI/CD, Git Graph, Infrastructure y Live Warnings.

## Ejecutar localmente
Abre `index.html` en el navegador. No necesita build ni dependencias de Node.

## Publicar en GitHub Pages
1. Sube `index.html`, `styles.css` y `app.js` a la raíz de un repositorio.
2. En GitHub: **Settings → Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**.
4. Selecciona `main` y `/ (root)` y guarda.

## Interacciones incluidas
- Navegación por módulos con paneles de detalle.
- Selector PROD / STAGING / DEV.
- Búsqueda de demostración.
- Filtrado visual de ramas Git.
- Alertas con detalles y acciones sugeridas.
- Pipeline interactivo con animación de ejecución.
- Panel Governance & Security.
- AI Assistant local basado en respuestas de demostración.

## Importante
Los datos son simulados. Para información real hay que conectar GitHub, AWS, Azure, GCP o Datadog mediante un backend seguro. No incluyas tokens ni credenciales en el frontend público.
