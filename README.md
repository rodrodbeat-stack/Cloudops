# NEXUS // CloudOps Control Plane

Dashboard web estático de demostración para CloudOps / DevSecOps con estética oscura, acentos neón, navegación por módulos e interacciones locales.

## Incluye
- Overview con métricas de gobernanza, seguridad, pipeline y políticas.
- Git Graph visual con ramas `main`, `release/v2.8` y `feature/security`.
- Centro de hallazgos de seguridad y controles Zero Trust.
- Flujo CI/CD simulado: Source → Build → SAST/QA → Security Gate → Deploy → Monitor.
- Vista de gobernanza y auditoría.
- Infraestructura de demostración para AWS, Azure, GCP y Kubernetes.
- Filtro de repositorios, selector de entorno, búsqueda, notificaciones, modales y asistente local.
- Diseño adaptable para escritorio y móvil.

## Publicar en GitHub Pages
1. Descarga y descomprime el ZIP.
2. En el repositorio `rodrodbeat-stack/Cloudops`, abre **Add file → Upload files**.
3. Sube `index.html`, `styles.css`, `app.js` y `README.md` a la raíz del repositorio y confirma los cambios en `main`.
4. Espera a que GitHub Pages actualice la web.

## Importante
Esta versión es una interfaz de demostración: los indicadores, eventos, conectores cloud y resultados de pipeline son ficticios. No se conecta a cuentas reales ni realiza despliegues. Para producción, conectar APIs con autenticación y autorización del lado servidor.
