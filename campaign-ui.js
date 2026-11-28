/* Live campaign presentation: no independent combat, economy or save state. */
(function(){'use strict';
const $=id=>document.getElementById(id), E=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
let installed=false,screen='menu',previousMode=null,live=null,ui={},selected=null,lastCapture=null,rosterKey='',mapKey='';
const active=s=>s&&s.mode!=='prep';
function choosePage(page){
 if(!live||active(live))return;
 screen=page;paint();window.scrollTo?.(0,0);
}
function btn(label,fn){const b=E('button','btn secondary compact',label);b.type='button';b.addEventListener('click',fn);return b}
function skill(tab){if(active(live))return;$('openSkillTree').click();$(tab).click()}
function install(){
 const shell=document.querySelector('.shell'),layout=document.querySelector('.layout'),field=document.querySelector('.battleground'),side=document.querySelector('.sidebar');
 if(!shell||!layout||!field||!side)return false;
 const merchant=$('shopTitle').closest('.panel'),test=$('testingPanel'),quest=$('questPanel'),pool=$('odds').closest('.panel'),encounter=$('encounterName').closest('.panel'),tree=$('openSkillTree').closest('.panel'),log=$('events').closest('.panel');
 const nav=E('nav','fw-live-nav'),pages=E('div','fw-live-pages'),menu=E('section','fw-live-menu'),map=E('section','fw-live-map'),shop=E('section','fw-live-shop'),dev=E('section','fw-live-dev');
 const title=E('h2',null,'Fantasy Warriors'),lead=E('p',null,'Defend the realm. Build your army. Grow stronger with every completed attempt.');
 menu.append(E('div','fw-live-emblem','♜'),title,lead,btn('Continue campaign',()=>choosePage('map')),btn('Save & backup',()=>skill('skillBackupTab')));
 const mapTitle=E('h2',null,'The Realm'),mapInfo=E('p','fw-live-map-info'),regions=E('div','fw-live-regions'),mapActions=E('div','fw-live-actions');
 mapActions.append(btn('Prepare attempt',()=>choosePage('shop')),btn('Skill tree',()=>skill('skillTreeTab')),btn('Legacy & prestige',()=>skill('skillLegacyTab')),btn('Hero collection',()=>skill('skillSkinsTab')));
 map.append(mapTitle,mapInfo,regions,mapActions);
 const merchantHeader=E('div','fw-live-merchant-banner');merchantHeader.append(E('span','fw-live-emblem','✦'),E('div',null,'The Merchant · finite stock'));
 const prepSpells=E('div','fw-live-prep-spells');
 shop.append(merchantHeader,merchant,prepSpells,encounter,pool);
 dev.append(test,quest,tree,log);
 const deployment=E('div','fw-live-deployment');deployment.hidden=true;deployment.setAttribute('role','status');field.append(deployment);
 const battleControls=E('div','fw-live-battle-controls');const abandon=btn('Abandon attempt',()=>ui.abandon?.());battleControls.append($('pauseButton'),abandon,E('small',null,'Aim with mouse or tap · rescue downed heroes on the field.'));
 field.append(battleControls);
 const roster=E('div','fw-live-roster'),portrait=E('div','fw-live-portrait'),rosterButtons=E('div','fw-live-roster-buttons'),glyph=E('div','fw-live-emblem'),heroName=E('h3'),heroDetail=E('p'),health=E('progress'),rescue=btn('Rescue',()=>{if(selected!=null)ui.press?.(selected)});
 health.max=100;health.value=0;portrait.append(glyph,heroName,heroDetail,health,rescue);roster.append(E('h2',null,'Heroes in battle'),rosterButtons,portrait);
 const formation=$('formation');roster.append(formation);roster.append($('formationCount'));side.append(roster);
 // Keep all original nodes and their listeners; only change where they are presented.
 const battleActions=$('battleActions'),canvasWrap=$('arena').parentElement;
 const buttons={};for(const [page,label] of [['menu','Menu'],['map','Realm'],['shop','Merchant'],['dev','Testing & log']]){buttons[page]=btn(label,()=>choosePage(page));nav.append(buttons[page])}
 buttons.tree=btn('Upgrades',()=>skill('skillTreeTab'));buttons.collection=btn('Collection',()=>skill('skillSkinsTab'));nav.append(buttons.tree,buttons.collection);
 pages.append(menu,map,shop,dev);shell.insertBefore(nav,layout);shell.insertBefore(pages,layout);
 ui={...ui,shell,layout,field,side,menu,map,shop,dev,buttons,mapInfo,regions,mapActions,battleControls,abandon,deployment,roster,rosterButtons,portrait,glyph,heroName,heroDetail,health,rescue,prepSpells,battleActions,canvasWrap,test,merchant};
 shell.classList.add('fw-live');document.body.classList.add('fw-live-body');installed=true;return true;
}
function renderMap(){
 const p=window.FWSkillTree.debug(),end=window.FWSkillTree.endlessState(),data=window.FWGameData.ENCOUNTERS;
 const key=JSON.stringify([live.stage,live.endlessWave,live.endlessHub,p.runClears,p.up,p.shards,p.resets,end.deepest]);
 if(mapKey===key)return;mapKey=key;
 ui.mapInfo.textContent=p.resets+' prestiges · '+p.up.toFixed(2)+' UP · '+p.shards.toFixed(2)+' Shards · '+(live.endlessHub?'Campaign complete':live.endlessWave?'Endless wave '+live.endlessWave:'Stage '+live.stage+' / 10');
 ui.regions.replaceChildren(...data.map((r,i)=>{
  const n=i+1,cleared=p.runClears.includes(n),current=!live.endlessWave&&!live.endlessHub&&live.stage===n;
  const b=btn(n+'. '+r.name+' · '+(current?'Current':cleared?'Cleared':'Locked'),()=>choosePage('shop'));b.classList.add('fw-live-region');b.disabled=!current;b.dataset.state=current?'current':cleared?'cleared':'locked';return b;
 }));
 ui.mapActions.firstElementChild.textContent=live.endlessHub?'Endless & progression':live.endlessWave?'Prepare Endless wave':'Prepare attempt';
}
function renderRoster(){
 const list=live.heroes.filter(h=>!h.summonKind&&(h.hp>0||h.capture));
 if(live.selectedCapture!==lastCapture&&live.selectedCapture!=null&&list.some(h=>h.id===live.selectedCapture&&h.capture))selected=live.selectedCapture;lastCapture=live.selectedCapture;
 if(!list.some(h=>h.id===selected))selected=list[0]?.id??null;
 const key=list.map(h=>h.id+':'+(h.capture?'capture':'active')+':'+h.skin?.id).join('|')+'/'+selected;
 if(key!==rosterKey){rosterKey=key;ui.rosterButtons.replaceChildren(...list.map(h=>{const b=btn(h.base.glyph+' '+h.base.name,()=>{selected=h.id;rosterKey='';renderRoster()});b.setAttribute('aria-pressed',String(h.id===selected));return b}))}
 const h=list.find(h=>h.id===selected);ui.portrait.hidden=!h;
 if(!h){ui.rescue.hidden=true;return}
 ui.glyph.textContent=h.base.glyph;ui.glyph.style.color=h.skin?.trim||h.base.color;ui.heroName.textContent=h.base.name+' · '+(h.skin?.rarity||h.base.rarity);
 const c=h.capture;
 ui.heroDetail.textContent=c?(c.required?'Capture · '+Math.floor(c.progress)+' / '+c.required+' rescue taps':'Capture · no rescues remaining')+' · '+Math.max(0,c.expires-live.elapsed).toFixed(1)+'s':Math.ceil(h.hp)+' / '+h.maxHp+' HP · '+(h.skin?.name||'Base skin')+' · '+h.base.role;
 ui.health.value=c?(c.required?100*c.progress/c.required:0):100*Math.max(0,h.hp)/Math.max(1,h.maxHp);
 ui.rescue.hidden=!c;ui.rescue.disabled=!!live.paused||!c?.required;ui.rescue.textContent=c?'Rescue '+Math.floor(c.progress)+'/'+c.required:'Rescue';
}
function paint(){
 const combat=active(live);if(combat)screen='battle';
 ui.shell.dataset.screen=screen;
 for(const k of ['menu','map','shop','dev'])ui[k].hidden=screen!==k;
 ui.layout.hidden=!combat;ui.side.hidden=!combat;
 for(const [k,b] of Object.entries(ui.buttons)){b.disabled=!!combat;b.setAttribute('aria-current',k===screen?'page':'false')}
 if(combat){ui.abandon.disabled=live.mode!=='battle';if(ui.battleActions.parentElement!==ui.field)ui.field.insertBefore(ui.battleActions,ui.canvasWrap);renderRoster()}
 else {if(ui.battleActions.parentElement!==ui.prepSpells)ui.prepSpells.append(ui.battleActions);renderMap()}
 // In testing, keep the actual controls available instead of making a second test state.
 if(!combat&&live.testMode&&screen==='shop')ui.shop.append(ui.test);else if(ui.test.parentElement!==ui.dev)ui.dev.prepend(ui.test);
}
function sync(state,press,abandon){
 live=state;ui.press=press;ui.abandon=abandon;if(!installed&&!install())return;
 if(previousMode&&previousMode!=='prep'&&state.mode==='prep'){screen=previousMode==='clear'||previousMode==='champion'?'map':'shop';selected=null;lastCapture=null;window.scrollTo?.(0,0)}
 const began=state.mode==='battle'&&previousMode!=='battle';previousMode=state.mode;paint();
 if(began){window.scrollTo?.(0,0);ui.deployment.replaceChildren(...state.heroes.filter(h=>!h.summonKind).map(h=>{const x=E('span','fw-live-dealt',h.base.glyph+' '+h.base.name+' · '+(h.skin?.rarity||h.base.rarity));x.style.borderColor=h.skin?.trim||h.base.color;return x}));ui.deployment.hidden=!ui.deployment.children.length;ui.deployment.classList.remove('dealing');void ui.deployment.offsetWidth;ui.deployment.classList.add('dealing')}else if(state.mode!=='battle'||state.elapsed>2.3)ui.deployment.hidden=true;
}
function prepareField(){if(!installed)return;ui.layout.hidden=false;ui.side.hidden=false;ui.shell.dataset.screen='battle';}
window.FWCampaignUI={sync,prepareField};
})();