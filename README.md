# 888DIGITALFACTORY // CloudOps Control Plane

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


## CI/CD Command Center (página nueva)
- `cicd.html`: dashboard independiente de CI/CD.
- `cicd.css`: estilos específicos del dashboard CI/CD.
- `cicd.js`: interacción, animación de etapas/branches, logs, historial y exportación CSV.
- El módulo CI/CD del Overview ahora abre `cicd.html`.

Todo es una simulación visual local. No se conectan runners, repositorios, cuentas cloud ni despliegues reales.

## Dashboards por entorno

Los botones DEV, QA, STAGING y PROD abren `environment.html?env=...`, un dashboard separado por entorno con métricas y acciones de demostración. Los botones no realizan cambios reales en AWS, Azure ni Kubernetes.


## Infrastructure Architecture Graph
- Los cuadros AWS, Azure, Google Cloud y Kubernetes del módulo Infrastructure abren `infrastructure.html` con la arquitectura seleccionada.
- El grafo permite seleccionar componentes, consultar detalles y resaltar dependencias.
- `Run traffic flow` anima conexiones y registra eventos de simulación.
- Los diagramas y métricas son ilustrativos; no representan cuentas ni tráfico cloud reales.
- Archivos añadidos: `infrastructure.html`, `infrastructure.css`, `infrastructure.js`.


## Security & Governance Architecture Graphs
- `security.html`: grafo interactivo de identidad, edge protection, posture, secretos, pipeline scanning, workloads, detección y auditoría.
- `governance.html`: grafo interactivo de organización, políticas, RBAC, costos/tags, landing zones, estándares, compliance y evidencias.
- `sg-graph.css` y `sg-graph.js`: estilos compartidos, selección de nodos, dependencias resaltadas, animación del flujo y logs de simulación.
- Desde Overview, los paneles Security y Governance enlazan a sus respectivos dashboards.
- Los flujos y métricas son demostrativos; no modifican políticas ni se conectan a cuentas reales.
