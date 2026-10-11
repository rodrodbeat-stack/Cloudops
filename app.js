/* 888DIGITALFACTORY CloudOps Control Plane — interactive demo, no live cloud integrations */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const toastRegion = $('#toastRegion');
  const safeOn = (selector, event, handler) => { const el = $(selector); if (el) el.addEventListener(event, handler); return el; };
  function toast(message) {
    if (!toastRegion) return;
    const el = document.createElement('div'); el.className = 'toast'; el.textContent = message;
    toastRegion.append(el); window.setTimeout(() => el.remove(), 3600);
  }
  function updateClock() { const el = $('#clock'); if (el) el.textContent = new Date().toLocaleTimeString('es-CL', { hour12: false }); }
  updateClock(); window.setInterval(updateClock, 1000);

  const pageNames = {
    overview: ['OVERVIEW', 'Control Plane'], git: ['GIT GRAPH', 'Git Graph'],
    security: ['SECURITY', 'Security Center'], governance: ['GOVERNANCE', 'Governance'],
    cicd: ['CI/CD PIPELINE', 'Secure Delivery'], infrastructure: ['INFRASTRUCTURE', 'Infrastructure'],
    audit: ['AUDIT LOGS', 'Audit Logs']
  };
  function jump(id) {
    if (id === 'cicd' && !document.body.classList.contains('cicd-page')) { window.location.href = 'cicd.html'; return; }
    const target = document.getElementById(id); if (!target) { toast(`Módulo ${id} no disponible.`); return; }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    $$('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.target === id));
    const info = pageNames[id] || pageNames.overview;
    const crumb = $('#crumb'), title = $('#pageTitle');
    if (crumb) crumb.textContent = info[0];
    if (title) title.innerHTML = `${info[1]}<span class="accent">.</span>`;
  }
  $$('.nav-item[data-target]').forEach(btn => btn.addEventListener('click', () => jump(btn.dataset.target)));
  $$('[data-jump]').forEach(btn => btn.addEventListener('click', () => jump(btn.dataset.jump)));

  $$('.env[data-env]').forEach(btn => btn.addEventListener('click', () => {
    const env = btn.dataset.env;
    window.location.href = `environment.html?env=${encodeURIComponent(env)}&from=overview`;
  }));

  safeOn('#refreshBtn', 'click', () => {
    toast('Dashboard actualizado con datos de demostración.');
    const btn = $('#refreshBtn'); if (btn) { btn.textContent = '✓ Updated'; setTimeout(() => btn.textContent = '↻ Refresh', 1200); }
  });
  safeOn('#alertsBtn', 'click', () => { jump('security'); toast('Hallazgos de ejemplo: 1 crítico, 2 altos y 4 medios.'); });
  safeOn('#repoFilter', 'change', e => {
    const repo = e.target.value; const label = $('#pipelineRepo');
    if (label) label.textContent = repo === 'all' ? 'payments-api' : repo;
    toast(repo === 'all' ? 'Mostrando repositorios de demostración.' : `Repositorio seleccionado: ${repo}`);
  });
  safeOn('#branchFilter', 'input', e => {
    const q = e.target.value.trim().toLowerCase(); let count = 0;
    $$('.branch-names span').forEach(el => { const match = !q || el.textContent.toLowerCase().includes(q); el.classList.toggle('branch-hidden', !match); if (match) count++; });
    if (q && !count) toast('No se encontró una rama con ese nombre.');
  });
  safeOn('#globalSearch', 'keydown', e => {
    if (e.key !== 'Enter') return;
    const q = e.target.value.trim().toLowerCase(); if (!q) return;
    const map = [
      ['overview', 'overview dashboard control plane métricas'], ['git', 'git graph branch rama repository repositorio commit'],
      ['security', 'security seguridad risk riesgo vulnerability vulnerabilidad iam secret alerta'],
      ['governance', 'governance gobernanza policy política compliance cumplimiento control'],
      ['cicd', 'pipeline cicd build deploy sast qa source monitor'],
      ['infrastructure', 'infrastructure infraestructura aws azure gcp kubernetes cloud'], ['audit', 'audit logs auditoría log evento trazabilidad']
    ];
    const match = map.find(([, words]) => words.split(' ').some(w => w.includes(q) || q.includes(w)));
    if (match) { jump(match[0]); toast(`Abriendo módulo relacionado con “${e.target.value}”.`); return; }
    const warning = $$('.warning-card').find(el => el.textContent.toLowerCase().includes(q));
    if (warning) { jump('security'); warning.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    else toast('Sin coincidencias en los datos de demostración.');
  });

  const dialog = $('#detailDialog');
  function openDetail(title, body) {
    if (!dialog) return;
    if ($('#dialogTitle')) $('#dialogTitle').textContent = title;
    if ($('#dialogContent')) $('#dialogContent').innerHTML = body;
    if (typeof dialog.showModal === 'function') dialog.showModal(); else toast(`${title}: abre los detalles en un navegador compatible.`);
  }
  $$('[data-detail]').forEach(btn => btn.addEventListener('click', () => {
    const title = btn.dataset.detail;
    if (title === 'Governance controls') {
      openDetail(title, '<ul><li>Identidad y acceso: RBAC y mínimo privilegio.</li><li>Protección de datos: cifrado y gestión de claves.</li><li>Etiquetado: owner, environment y cost center.</li><li>Auditoría: trazabilidad de cambios y retención de logs.</li></ul>');
    } else {
      openDetail(title, `<p><b>Estado:</b> requiere revisión en esta demo.</p><p><b>Acción recomendada:</b> validar el propietario, revisar eventos relacionados y registrar la remediación.</p><p><b>Entorno:</b> ${$('#currentEnv')?.textContent || 'DEV'}. <span style="color:#ffae42">No se ejecutan cambios reales en la nube.</span></p>`);
    }
  }));
  safeOn('#closeDialog', 'click', () => dialog?.close());
  safeOn('#viewAllWarnings', 'click', () => {
    jump('security'); openDetail('Security findings', '<p><b>1 crítico:</b> IAM policy drift.</p><p><b>2 altos:</b> secret scan y vulnerabilidades de dependencias.</p><p><b>4 medios:</b> observabilidad, tags y controles de configuración.</p><p>Estos hallazgos son ilustrativos; no proceden de un escaneo real.</p>');
  });

  // Pipeline animation: updates each stage, connectors and branch graph in sync.
  let running = false;
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  safeOn('#runPipeline', 'click', async () => {
    if (running) return;
    const flow = $('#pipelineFlow'); const graph = $('.graph-wrap'); const button = $('#runPipeline');
    if (!flow || !button) return;
    running = true; button.disabled = true; button.textContent = '⟳ Running pipeline…';
    const stages = $$('.stage', flow), connectors = $$('.connector', flow);
    stages.forEach(stage => { stage.classList.remove('done', 'warn', 'stage-running', 'failed'); stage.querySelector('small').textContent = 'Queued'; stage.querySelector('i').textContent = '○'; });
    connectors.forEach(c => c.classList.remove('connector-done'));
    flow.classList.add('is-running'); graph?.classList.add('graph-running');
    toast('Pipeline iniciado: Source → Build → SAST/QA → Security Gate → Deploy → Monitor.');
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i]; stage.classList.add('stage-running'); stage.querySelector('small').textContent = 'Running…'; stage.querySelector('i').textContent = '◌';
      if (graph) graph.dataset.activeStage = String(i);
      await wait(850);
      stage.classList.remove('stage-running');
      if (i === 3) {
        stage.classList.add('warn'); stage.querySelector('small').textContent = 'Review issue'; stage.querySelector('i').textContent = '!';
      } else {
        stage.classList.add('done'); stage.querySelector('small').textContent = 'Passed'; stage.querySelector('i').textContent = '✓';
      }
      if (connectors[i]) connectors[i].classList.add('connector-done');
    }
    flow.classList.remove('is-running'); graph?.classList.remove('graph-running');
    button.disabled = false; button.textContent = '▶ Run demo pipeline'; running = false;
    toast('Pipeline demo completado. Security Gate detectó un hallazgo para revisión; Deploy es solo visual y no ejecutó despliegues reales.');
    const log = $('#audit'); if (log) { const rows = $('.audit-table', log); if (rows) { const row = document.createElement('div'); row.className = 'audit-row'; row.innerHTML = `<span>${new Date().toLocaleTimeString('es-CL', {hour12:false})}</span><span>ci-bot</span><span>Pipeline demo completado · ${$('#pipelineRepo')?.textContent || 'payments-api'}</span><em class="good">SUCCESS</em>`; rows.append(row); } }
  });

  // Provider cards and metric cards open their respective module details.
  $$('.provider').forEach(card => {
    card.tabIndex = 0; card.setAttribute('role', 'button');
    const open = () => openDetail(card.querySelector('b')?.textContent || 'Cloud provider', `<p>${card.querySelector('small')?.textContent || 'Servicios cloud'}.</p><p><b>Estado:</b> conexión de demostración.</p><p>Para obtener métricas reales se necesita configurar una integración segura y permisos de solo lectura.</p>`);
    card.addEventListener('click', open); card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  $$('.metric-card').forEach((card, i) => {
    card.tabIndex = 0; card.setAttribute('role', 'button');
    const target = ['governance', 'security', 'cicd', 'governance'][i];
    const open = () => jump(target); card.addEventListener('click', open); card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  safeOn('#aiOpen', 'click', () => { const ai = $('#aiDialog'); if (ai?.showModal) ai.showModal(); });
  safeOn('#closeAi', 'click', () => $('#aiDialog')?.close());
  const replies = [
    [/security|riesgo|vulnerab|alerta|critical|cr[ií]tic/i, 'Hay 7 hallazgos simulados: 1 crítico de IAM, 2 altos y 4 medios. Prioriza revisar permisos de app-prod y comprobar que no existan secretos en el repositorio.'],
    [/pipeline|cicd|deploy|desplieg/i, 'El flujo demo contiene Source, Build, SAST/QA, Security Gate, Deploy y Monitor. El botón Run demo pipeline anima cada etapa y las ramas; no despliega recursos reales.'],
    [/governance|gobern|policy|pol[ií]tica|compliance|cumplimiento/i, 'El score de gobernanza es 96% (dato de ejemplo). Revisa Resource Tagging y confirma owner, environment y cost center.'],
    [/infra|aws|azure|gcp|kubernetes|cloud/i, 'La vista de infraestructura muestra conectores de demostración para AWS, Azure, Google Cloud y Kubernetes. No hay cuentas cloud conectadas ni telemetría real.'],
    [/git|repo|branch|rama|commit/i, 'El Git Graph representa main, release/v2.8 y feature/security. Los commits y repositorios son datos ficticios.'],
    [/audit|log|trazab/i, 'Audit Logs contiene eventos de ejemplo. Para producción, conecta un backend de logs y define retención y control de acceso.']
  ];
  safeOn('#chatForm', 'submit', e => {
    e.preventDefault(); const input = $('#chatInput'), q = input?.value.trim(); if (!q) return;
    const log = $('#chatLog'); const user = document.createElement('div'); user.className = 'chat-bubble user'; user.textContent = q; log?.append(user);
    const match = replies.find(([re]) => re.test(q)); const bot = document.createElement('div'); bot.className = 'chat-bubble bot';
    bot.textContent = match ? match[1] : 'Puedo orientarte sobre seguridad, CI/CD, gobernanza, Git Graph, infraestructura y auditoría.'; log?.append(bot); input.value = ''; if (log) log.scrollTop = log.scrollHeight;
  });
  // Ensure there are no null-selector exceptions if optional elements are absent.
})();
