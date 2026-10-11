const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const toastRegion = $('#toastRegion');
function toast(message){const el=document.createElement('div');el.className='toast';el.textContent=message;toastRegion.append(el);setTimeout(()=>el.remove(),3500)}
function showDetails(title, rows){$('#dialogTitle').textContent=title;$('#dialogContent').innerHTML=`<table class="detail-table"><thead><tr><th>Control / componente</th><th>Estado</th><th>Detalle</th></tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;$('#detailDialog').showModal()}
const detailData={
'Overview':[['Governance Score','96%','48 de 50 políticas conformes'],['Security Findings','7 abiertos','1 crítico · 2 altos · 4 medios'],['Pipeline Success','98.4%','42 ejecuciones exitosas'],['Policy Violations','3 activas','Revisar recursos sin tags']],
'Git Graph':[['payments-api','Healthy','main · release/v2.8 · feature/payment'],['platform-infra','Healthy','Terraform modules · Helm charts'],['observability','Healthy','Dashboards y alertas versionados']],
'Governance':[['Policy compliance','96%','48 de 50 controles conformes'],['Resource tagging','97%','Owner, Environment, CostCenter'],['RBAC','Healthy','124 usuarios · mínimo privilegio'],['Cost management','Monitoring','Presupuestos y anomalías']],
'Security':[['IAM policy drift','CRITICAL','Role app-prod con permisos adicionales'],['Secret scan','HIGH','Revisar repositorio payments'],['Encryption','Compliant','AES-256 at rest · TLS 1.3 in transit'],['Audit Trail','Enabled','1.248 eventos · retención 365 días']],
'CI/CD':[['Source','Passed','Commit a3f9c2e'],['Build','Passed','Artefacto generado'],['SAST / QA','Passed','Análisis estático y pruebas OK'],['Security Gate','Warning','1 hallazgo pendiente de revisión'],['Deploy / Monitor','Healthy','v2.8.0 · health checks 3/5']],
'Infrastructure':[['AWS','Operational','CloudTrail · Config · IAM'],['Azure','Operational','Azure Policy · Monitor'],['GCP','Operational','Audit Logs · Cloud Monitoring'],['Kubernetes','Healthy','Clusters y workloads supervisados'],['Terraform','Managed','Cambios IaC versionados']],
'Audit Logs':[['14:42:03','INFO','Pipeline #482 completado'],['14:39:11','WARN','Tag requerido ausente en 3 recursos'],['14:31:44','CRITICAL','IAM policy drift detectado'],['14:18:07','INFO','Usuario r.rodriguez inició sesión']]
};
$$('.nav-item').forEach(btn=>btn.addEventListener('click',()=>{ $$('.nav-item').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const p=btn.dataset.page;$('#pageTitle').textContent=p;$('#crumb').textContent=p.toUpperCase();if(p!=='Overview')showDetails(p,detailData[p]||detailData.Overview);else toast('Overview actualizado · todos los sistemas operativos');}));
$$('.env').forEach(btn=>btn.addEventListener('click',()=>{$$('.env').forEach(b=>b.classList.remove('active'));btn.classList.add('active');$('#pipelineEnv').textContent=btn.textContent;toast(`Entorno cambiado a ${btn.textContent}. Datos de demostración.`)}));
$('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){const q=e.target.value.trim();if(q)showDetails(`Resultados: ${q}`,[['payments-api','Repository','Commit a3f9c2e'],['app-prod','IAM policy','Revisión recomendada'],['Pipeline #482','CI/CD','1 warning en Security Gate']]);}});
$('#branchFilter').addEventListener('input',e=>{$$('.branch-label').forEach(el=>el.style.opacity=el.textContent.toLowerCase().includes(e.target.value.toLowerCase())?'1':'.12');});
$('#repoFilter').addEventListener('change',e=>toast(`Repositorio seleccionado: ${e.target.value} · vista de demostración`));
$('#refreshGraph').addEventListener('click',()=>{const graph=$('#graph');graph.animate([{opacity:.4},{opacity:1}],{duration:450});toast('Git Graph actualizado · commits sincronizados');});
$('#viewAllWarnings').addEventListener('click',()=>showDetails('Live Warnings',[['CRITICAL','IAM policy drift','Role app-prod has extra permissions'],['HIGH','Secret scan failed','Potential exposed credential in payments'],['MEDIUM','Health check','api-gateway healthy 3/5'],['MEDIUM','Untagged resources','3 resources missing required tags']]));
$$('.warning-card').forEach(card=>card.addEventListener('click',()=>{const title=$('strong',card).textContent;showDetails(title,[[$('.warn-meta b',card).textContent,'Open',$('p',card).textContent],['Recommended action','Investigate','Validate ownership, scope and remediation plan'],['Audit','Traceable','Attach remediation evidence before closure']]);}));
$$('.stage').forEach(stage=>stage.addEventListener('click',()=>{const name=stage.dataset.stage;showDetails(`Pipeline stage · ${name}`,[['Stage',name,stage.classList.contains('warn')?'Warning':'Passed'],['Environment',$('#pipelineEnv').textContent,'Demo environment'],['Execution','Latest run','Pipeline #482 · last run 2 minutes ago'],['Traceability','Enabled','Commit a3f9c2e']]);}));
$('#runPipeline').addEventListener('click',()=>{const stages=$$('.stage');const button=$('#runPipeline');button.disabled=true;button.textContent='⟳ Running pipeline...';stages.forEach(s=>{s.classList.remove('done','warn');s.style.opacity='.45';$('small',s).textContent='Queued';$('i',s).textContent='·'});let i=0;const tick=()=>{if(i>0){stages[i-1].style.opacity='1';stages[i-1].classList.add(i-1===4?'warn':'done');$('small',stages[i-1]).textContent=i-1===4?'1 issue':'Passed';$('i',stages[i-1]).textContent=i-1===4?'!':'✓'}if(i<stages.length){stages[i].style.opacity='1';$('small',stages[i]).textContent='Running';i++;setTimeout(tick,500)}else{button.disabled=false;button.textContent='▶ Run demo pipeline';toast('Pipeline demo completado: 6 stages OK · Security Gate con 1 warning');}};tick();});
$('#pipelineView').addEventListener('click',()=>showDetails('CI/CD Pipeline',detailData['CI/CD']));
$('#governanceDetails').addEventListener('click',()=>showDetails('Governance & Security',[['SOC 2','98%','Compliant'],['ISO 27001','95%','2 controls to review'],['NIST','93%','Continuous monitoring'],['PCI-DSS','90%','Payment environment controls'],['RBAC','Healthy','Least privilege']]));
$('#alertsBtn').addEventListener('click',()=>$('#warnings').scrollIntoView({behavior:'smooth',block:'center'}));
$('#closeDialog').addEventListener('click',()=>$('#detailDialog').close());
$('#aiOpen').addEventListener('click',()=>$('#aiDialog').showModal());$('#closeAi').addEventListener('click',()=>$('#aiDialog').close());
$('#chatForm').addEventListener('submit', e => {
    e.preventDefault();

    const input = $('#chatInput');
    const question = input.value.trim();

    if (!question) return;

    const log = $('#chatLog');
    const user = document.createElement('div');

    user.className = 'chat-bubble user';
    user.textContent = question;
    log.append(user);

    const bot = document.createElement('div');
    bot.className = 'chat-bubble bot';

    const q = question.toLowerCase();

    if (q.includes('seguridad') || q.includes('vulnerabilidad') || q.includes('iam')) {
        bot.textContent = 'Seguridad: 7 hallazgos simulados. Hay 1 crítico, 2 altos y 4 medios. Revisa los permisos IAM y el análisis de secretos.';
    } else if (q.includes('pipeline') || q.includes('cicd') || q.includes('deploy')) {
        bot.textContent = 'CI/CD: el dashboard muestra un 98,4% de éxito simulado. Revisa el Security Gate antes de desplegar.';
    } else if (q.includes('governance') || q.includes('gobernanza') || q.includes('policy') || q.includes('tag')) {
        bot.textContent = 'Governance: puntuación simulada del 96%, con 48 de 50 políticas conformes y 3 recursos sin etiquetas obligatorias.';
    } else if (q.includes('aws') || q.includes('azure') || q.includes('gcp') || q.includes('infraestructura')) {
        bot.textContent = 'Infrastructure: AWS, Azure y GCP aparecen como conectores de demostración. Todavía no hay conexión con servicios reales.';
    } else {
        bot.textContent = 'CloudOps Assistant: puedo ayudarte con seguridad, CI/CD, gobernanza e infraestructura. Los indicadores actuales son datos de demostración.';
    }

    log.append(bot);
    input.value = '';
    log.scrollTop = log.scrollHeight;
});

if ($('#clock')) {
    $('#clock').textContent = 'Updated just now';
}
