/* Public-repository GitHub Actions sync for CloudOps. No token is embedded. */
(() => {
  const owner = 'rodrodbeat-stack';
  const repo = 'Cloudops';
  const workflow = 'secure-cicd.yml';
  const api = `https://api.github.com/repos/${owner}/${repo}`;

  function addButton() {
    if (document.getElementById('githubActionsSync')) return;
    const button = document.createElement('button');
    button.id = 'githubActionsSync';
    button.type = 'button';
    button.textContent = '↻ Sync GitHub Jobs';
    Object.assign(button.style, {
      position: 'fixed', right: '18px', bottom: '18px', zIndex: '99999',
      padding: '12px 16px', border: '1px solid #00e5ff', borderRadius: '8px',
      background: '#07131d', color: '#00e5ff', font: '600 13px system-ui',
      cursor: 'pointer', boxShadow: '0 0 18px #00e5ff33'
    });
    button.addEventListener('click', sync);
    document.body.appendChild(button);
  }

  async function getJson(url) {
    const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error(`GitHub API ${response.status} en ${url}`);
    return response.json();
  }

  async function sync() {
    const button = document.getElementById('githubActionsSync');
    button.disabled = true;
    button.textContent = '⟳ Consultando GitHub…';
    try {
      const runsData = await getJson(`${api}/actions/workflows/${workflow}/runs?per_page=1`);
      const run = runsData.workflow_runs && runsData.workflow_runs[0];
      if (!run) {
        showResult('GitHub Actions', [
          ['Workflow', 'NOT FOUND', 'No hay ejecuciones de secure-cicd.yml. Sube .github/workflows/secure-cicd.yml a la rama main y realiza un commit.']
        ]);
        return;
      }
      const jobsData = await getJson(`${api}/actions/runs/${run.id}/jobs?per_page=100`);
      const rows = [
        ['Workflow', run.name || workflow, `Run #${run.run_number} · ${run.event} · ${run.head_sha.slice(0, 7)}`],
        ['Run status', run.conclusion || run.status, run.html_url]
      ];
      for (const job of (jobsData.jobs || [])) {
        rows.push([job.name, job.conclusion || job.status, `Started: ${job.started_at || 'pending'} · ${job.html_url}`]);
      }
      if (!(jobsData.jobs || []).length) rows.push(['Jobs', 'EMPTY', 'La ejecución todavía no ha creado jobs o la API no devolvió resultados.']);
      showResult('GitHub Actions · Jobs reales', rows);
      button.textContent = `✓ GitHub: ${(jobsData.jobs || []).length} jobs`;
    } catch (error) {
      showResult('GitHub Actions · Error de sincronización', [
        ['Conexión', 'ERROR', String(error.message || error)],
        ['Comprobación', 'Repository', `${owner}/${repo} debe ser público para consultar la API sin token.`]
      ]);
      button.textContent = '⚠ Sync error — reintentar';
    } finally {
      button.disabled = false;
    }
  }

  function showResult(title, rows) {
    if (typeof window.showDetails === 'function') {
      window.showDetails(title, rows);
      return;
    }
    const old = document.getElementById('githubActionsResults');
    if (old) old.remove();
    const panel = document.createElement('section');
    panel.id = 'githubActionsResults';
    Object.assign(panel.style, {
      position: 'fixed', inset: '8% 5%', zIndex: '100000', overflow: 'auto',
      padding: '20px', border: '1px solid #00e5ff', borderRadius: '10px',
      background: '#07131d', color: '#d8f7ff', font: '13px system-ui', boxShadow: '0 0 30px #000'
    });
    const close = document.createElement('button'); close.textContent = 'Cerrar';
    close.onclick = () => panel.remove();
    const heading = document.createElement('h2'); heading.textContent = title;
    panel.append(close, heading);
    const table = document.createElement('table');
    Object.assign(table.style, { width: '100%', borderCollapse: 'collapse' });
    for (const row of rows) {
      const tr = document.createElement('tr');
      for (const value of row) {
        const td = document.createElement('td'); td.textContent = String(value ?? '');
        Object.assign(td.style, { padding: '9px', borderBottom: '1px solid #24404d', overflowWrap: 'anywhere' });
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    panel.appendChild(table); document.body.appendChild(panel);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton);
  else addButton();
})();
