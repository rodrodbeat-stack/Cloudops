888DIGITALFACTORY CloudOps — GitHub Actions workflow + sync helper

ESTRUCTURA INCLUIDA
- .github/workflows/secure-cicd.yml: workflow que crea jobs reales en GitHub Actions.
- github-actions-sync.js: helper para consultar la última ejecución y sus jobs reales en el dashboard.

INSTALACIÓN
1. Copia la carpeta .github/ a la raíz del repositorio Cloudops y confirma los cambios en main.
2. Para integrar el botón de sincronización en la web, sube github-actions-sync.js a la raíz.
3. En index.html, antes de </body>, agrega:
   <script src="github-actions-sync.js"></script>
4. Haz commit/push a main.
5. Abre GitHub > Actions y confirma que aparece “888DIGITALFACTORY | Secure CI/CD”.
6. En el dashboard, pulsa “Sync GitHub Jobs”. El repositorio es público y la consulta usa la API pública sin token.

NOTAS
- El workflow está adaptado a la estructura actual observada del repositorio: index.html, styles.css y app.js.
- El despliegue existente de GitHub Pages se mantiene separado (pages-build-deployment).
- La API pública de GitHub tiene límites de solicitudes. No pongas tokens en JavaScript público.
- La primera ejecución se dispara al hacer push a main; también puedes lanzarla manualmente desde Actions > Secure CI/CD > Run workflow.
