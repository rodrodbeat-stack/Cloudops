const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const toastRegion = $('#toastRegion');
function toast(message){const el=document.createElement('div');el.className='toast';el.textContent=message;toastRegion.append(el);setTimeout(()=>el.remove(),3600)}
function updateClock(){const now=new Date();$('#clock').textContent=now.toLocaleTimeString('es-CL',{hour12:false})}
updateClock();setInterval(updateClock,1000);
const pageNames={overview:['OVERVIEW','Control Plane'],git:['GIT GRAPH','Git Graph'],security:['SECURITY','Security Center'],governance:['GOVERNANCE','Governance'],cicd:['CI/CD PIPELINE','Secure Delivery'],infrastructure:['INFRASTRUCTURE','Infrastructure'],audit:['AUDIT LOGS','Audit Logs']};
function jump(id){const target=document.getElementById(id);if(!target)return;target.scrollIntoView({behavior:'smooth',block:'start'});$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.target===id));const info=pageNames[id]||['OVERVIEW','Control Plane'];$('#crumb').textContent=info[0];$('#pageTitle').innerHTML=info[1]+'<span class="accent">.</span>'}
$$('.nav-item').forEach(btn=>btn.addEventListener('click',()=>jump(btn.dataset.target)));
$$('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>jump(btn.dataset.jump)));
$$('.env').forEach(btn=>btn.addEventListener('click',()=>{ $$('.env').forEach(x=>x.classList.toggle('active',x===btn));const env=btn.dataset.env;$('#currentEnv').textContent=env;$('#pipelineEnvLabel').textContent=env;$('#pipelineEnvLabel').parentElement.lastElementChild.textContent=env;toast(`Entorno activo cambiado a ${env}. Demo solamente.`)}));
$('#refreshBtn').addEventListener('click',()=>{toast('Panel actualizado con los datos de demostración.');$('#refreshBtn').textContent='✓ Updated';setTimeout(()=>$('#refreshBtn').textContent='↻ Refresh',1200)});
$('#refreshGraph').addEventListener('click',()=>toast('Git Graph actualizado: 3 repositorios de demostración.'));
$('#alertsBtn').addEventListener('click',()=>{jump('security');toast('Hay 7 hallazgos simulados: 1 crítico, 2 altos y 4 medios.')});
$('#pipelineView')?.addEventListener('click',()=>jump('cicd'));
const repoFilter=$('#repoFilter');repoFilter?.addEventListener('change',()=>{const repo=repoFilter.value;$('#pipelineRepo').textContent=repo==='all'?'payments-api':repo;toast(repo==='all'?'Mostrando todos los repositorios de demo.':`Repositorio seleccionado: ${repo}`)});
$('#branchFilter').addEventListener('input',e=>{const q=e.target.value.toLowerCase();$$('.branch-names span').forEach(x=>x.classList.toggle('hidden',q&&!x.textContent.toLowerCase().includes(q)));if(q&&!$$('.branch-names span').some(x=>x.textContent.toLowerCase().includes(q)))toast('No se encontró una rama con ese nombre.')});
$('#globalSearch').addEventListener('keydown',e=>{if(e.key!=='Enter')return;const q=e.target.value.trim().toLowerCase();if(!q)return;const map=[['git','git graph branch repository commit'],['security','security risk vulnerability iam secret'],['governance','governance policy compliance audit'],['cicd','pipeline cicd build deploy sast qa'],['infrastructure','infrastructure aws azure gcp kubernetes'],['audit','audit log event trace']];const match=map.find(([,words])=>words.split(' ').some(w=>q.includes(w)||w.includes(q)));if(match){jump(match[0]);toast(`Resultados relacionados con: ${e.target.value}`)}else{const found=$$('.warning-card').find(x=>x.textContent.toLowerCase().includes(q));if(found){jump('security');found.scrollIntoView({behavior:'smooth',block:'center'})}else toast('Sin coincidencias en los datos de demostración.')} });
const dialog=$('#detailDialog');function openDetail(title,body){$('#dialogTitle').textContent=title;$('#dialogContent').innerHTML=body;dialog.showModal()}
$$('[data-detail]').forEach(btn=>btn.addEventListener('click',()=>{const title=btn.dataset.detail;openDetail(title,`<p><b>Estado:</b> requiere revisión en este entorno de demostración.</p><p><b>Acción recomendada:</b> validar el propietario, revisar los eventos relacionados y registrar la remediación en el flujo de auditoría.</p><p><b>Entorno:</b> ${$('#currentEnv').textContent}. <span style="color:#ffae42">No se ejecutan cambios reales en la nube.</span></p>`)}));
$$('[data-detail="Governance controls"]').forEach(btn=>btn.addEventListener('click',()=>openDetail('Governance controls','<ul><li>Identidad y acceso: RBAC y mínimo privilegio.</li><li>Protección de datos: cifrado y gestión de claves.</li><li>Etiquetado: owner, environment, cost center.</li><li>Auditoría: trazabilidad de cambios y retención de logs.</li></ul>')));
$('#closeDialog').addEventListener('click',()=>dialog.close());$('#viewAllWarnings').addEventListener('click',()=>{jump('security');openDetail('Security findings','<p><b>1 crítico:</b> IAM policy drift.</p><p><b>2 altos:</b> secret scan y vulnerabilidades de dependencias.</p><p><b>4 medios:</b> observabilidad, tags y controles de configuración.</p><p>Estos hallazgos son datos ilustrativos, no un escaneo real.</p>')});
const pipeline=$('#pipelineFlow');
let running=false;
const graphSvg=$('.git-svg');
const branchPaths=graphSvg ? [...graphSvg.querySelectorAll('.main-branch,.release-branch,.feature-branch')] : [];
let branchRunners=[];
function clearBranchRunners(){branchRunners.forEach(x=>x.remove());branchRunners=[];graphSvg?.classList.remove('pipeline-graph-running');}
function createBranchRunners(){
  if(!graphSvg || !branchPaths.length) return;
  clearBranchRunners(); graphSvg.classList.add('pipeline-graph-running');
  branchPaths.forEach((path,index)=>{
    const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('r',index===0?'6':'5'); dot.setAttribute('class',`branch-runner runner-${index}`);
    graphSvg.appendChild(dot); branchRunners.push(dot);
  });
}
function moveBranchRunners(progress){
  branchPaths.forEach((path,index)=>{
    const dot=branchRunners[index]; if(!dot) return;
    const length=path.getTotalLength();
    const point=path.getPointAtLength(Math.min(length,Math.max(0,length*progress)));
    dot.setAttribute('cx',point.x); dot.setAttribute('cy',point.y);
  });
}
$('#runPipeline')?.addEventListener('click',async()=>{
  if(running) return;
  running=true;
  const button=$('#runPipeline');
  const stages=$$('.stage',pipeline);
  const connectors=$$('.connector',pipeline);
  button.disabled=true; button.textContent='⟳ Running pipeline...';
  pipeline.classList.add('is-running');
  stages.forEach((stage)=>{stage.classList.remove('done','warn','is-active');stage.querySelector('small').textContent='Queued';stage.querySelector('i').textContent='○'});
  connectors.forEach(connector=>connector.classList.remove('connector-done'));
  createBranchRunners();
  toast('Pipeline iniciado: observa el progreso en CI/CD y en las ramas del Git Graph.');
  for(let i=0;i<stages.length;i++){
    const stage=stages[i]; stage.classList.add('is-active');
    stage.querySelector('small').textContent='Running'; stage.querySelector('i').textContent='…';
    const start=performance.now(),duration=850;
    await new Promise(resolve=>{
      function tick(now){const p=Math.min(1,(now-start)/duration);moveBranchRunners(Math.min(1,(i+p)/stages.length));if(p<1)requestAnimationFrame(tick);else resolve();}
      requestAnimationFrame(tick);
    });
    stage.classList.remove('is-active');
    if(i===3){stage.classList.add('warn');stage.querySelector('small').textContent='1 issue';stage.querySelector('i').textContent='!';}
    else {stage.classList.add('done');stage.querySelector('small').textContent='Passed';stage.querySelector('i').textContent='✓';}
    if(connectors[i]) connectors[i].classList.add('connector-done');
  }
  pipeline.classList.remove('is-running');
  moveBranchRunners(1);
  button.disabled=false; button.textContent='▶ Run demo pipeline'; running=false;
  toast('Pipeline demo completado. El Security Gate detectó 1 hallazgo; Deploy queda como simulación y no publica cambios reales.');
  setTimeout(clearBranchRunners,1800);
});
$('#aiOpen').addEventListener('click',()=>$('#aiDialog').showModal());$('#closeAi').addEventListener('click',()=>$('#aiDialog').close());
const replies=[[/security|riesgo|vulnerab|alerta|critical|cr[ií]tic/i,'Hay 7 hallazgos simulados: 1 crítico de IAM, 2 altos y 4 medios. Prioriza revisar permisos de app-prod y comprobar que no existan secretos en el repositorio.'],[/pipeline|cicd|deploy|desplieg/i,'El flujo demo contiene Source, Build, SAST/QA, Security Gate, Deploy y Monitor. El Security Gate muestra 1 incidencia. El botón Run demo pipeline solo anima la simulación; no despliega nada.'],[/governance|gobern|policy|pol[ií]tica|compliance|cumplimiento/i,'El score de gobernanza es 96% (dato de ejemplo), con 48 de 50 controles conformes. Revisa Resource Tagging y confirma owner, environment y cost center.'],[/infra|aws|azure|gcp|kubernetes|cloud/i,'La vista de infraestructura muestra conectores de demostración para AWS, Azure, Google Cloud y Kubernetes. No hay cuentas cloud conectadas ni telemetría real.'],[/git|repo|branch|rama|commit/i,'El Git Graph representa ramas main, release/v2.8 y feature/security. Los commits y repositorios mostrados son datos ficticios de demostración.'],[/audit|log|trazab/i,'Audit Logs contiene eventos de ejemplo de CI bot, operador, motor de seguridad y Terraform bot. Para producción, conecta un backend de logs y define retención y control de acceso.']];
$('#chatForm').addEventListener('submit',e=>{e.preventDefault();const input=$('#chatInput'),q=input.value.trim();if(!q)return;const user=document.createElement('div');user.className='chat-bubble user';user.textContent=q;$('#chatLog').append(user);const match=replies.find(([re])=>re.test(q));const bot=document.createElement('div');bot.className='chat-bubble bot';bot.textContent=match?match[1]:'Puedo orientarte sobre seguridad, CI/CD, gobernanza, Git Graph, infraestructura y auditoría. Prueba preguntando por uno de esos módulos.';$('#chatLog').append(bot);input.value='';$('#chatLog').scrollTop=$('#chatLog').scrollHeight});
// All dashboard values and integrations are explicitly demo-only.
