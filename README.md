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

## Secure CI/CD GitHub Actions

The workflow `.github/workflows/secure-cicd.yml` models this operational chain:

`Commit → CI validation → Security Scan → Policy Validation → Package → GitHub Pages Deployment → Audit`

Jobs included:

1. **CI validation** — checks that key dashboard files exist and HTML files are not empty.
2. **Security Scan** — runs Gitleaks and a lightweight check for common hard-coded credential patterns.
3. **Policy Validation** — runs `scripts/policy-check.sh` for basic repository governance checks.
4. **Package dashboard** — prepares the static site and uploads a GitHub Pages artifact.
5. **Deployment** — deploys from `main` (not from pull requests) to GitHub Pages.
6. **Audit & Evidence** — records commit, run metadata, stage results, and publishes an audit artifact retained for 90 days.

### Enable GitHub Pages deployment

In the repository, open **Settings → Pages** and configure **Build and deployment → Source: GitHub Actions**. Push the workflow to `main`. Pull requests run validation, scanning, and policy checks but do not deploy. A deployment requires the earlier jobs to succeed.

> **Important:** These are starter guardrails for the static dashboard, not a complete enterprise security program. The checks are demonstrative and do not deploy workloads to AWS/Azure/GCP or validate real cloud resources. For production, pin third-party Actions to full commit SHAs, add dependency/SAST/DAST scanning and approvals as required, and replace the sample policy script with organization-specific policies (for example OPA/Conftest).
