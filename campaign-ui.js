/* Live campaign presentation: no independent combat, economy or save state. */
(function(){'use strict';
const $=id=>document.getElementById(id), E=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
let installed=false,screen='menu',previousMode=null,live=null,ui={},selected=null,lastCapture=null,rosterKey='',mapKey='';
const art=window.FWPrototypeArt;const icons=['●','♣','⚑','◆','▲','✚','✶','☾','◈','✺'];let sealed=false,portraitKey='',dealTimer=null,dealGeneration=0,showcaseQueue=[],knownBefore=new Set(),seenAppearances=new Set();try{seenAppearances=new Set(JSON.parse(localStorage.getItem('fw-ui-seen-appearances')||'[]'))}catch{}
function canvas(w,h,cls){const x=E('canvas',cls);x.width=w;x.height=h;x.setAttribute('aria-hidden','true');return x}
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
 const titleArt=canvas(320,180,'fw-pixel-background'),title=E('h2',null,'Fantasy Warriors'),lead=E('p',null,'A KINGDOM UNDER SIEGE'),menuBody=E('div','fw-title-body');
 art.title(titleArt);menuBody.append(lead,title,btn('Continue campaign',()=>choosePage('map')),btn('New Game',()=>{if(confirm('Start a fresh campaign? Export a backup first. This clears current progression.'))ui.newGame?.()}),btn('Settings',()=>settings()),btn('Save & backup',()=>skill('skillBackupTab')));menu.append(titleArt,menuBody,E('small','fw-art-label','PLACEHOLDER PIXEL ART'));
 const settings=()=>{const d=E('dialog','fw-settings');const h=E('h2',null,'Settings');d.append(h,E('p',null,'Sound and final artwork are not yet implemented.'),btn('Save & backup',()=>{d.close();skill('skillBackupTab')}),btn('Testing tools',()=>{d.close();choosePage('dev')}),btn('Close',()=>d.close()));document.body.append(d);d.addEventListener('close',()=>d.remove(),{once:true});d.showModal()};
 const mapTitle=E('h2',null,'The Realm'),mapInfo=E('p','fw-live-map-info'),regions=E('div','fw-live-regions'),mapActions=E('div','fw-live-actions');
 mapActions.append(btn('Prepare attempt',()=>choosePage('shop')),btn('Skill tree',()=>skill('skillTreeTab')),btn('Legacy & prestige',()=>skill('skillLegacyTab')),btn('Hero collection',()=>skill('skillSkinsTab')),btn('Settings',settings));const mapHeader=E('header','fw-screen-head'),mapArt=canvas(320,180,'fw-pixel-background');mapHeader.append(btn('‹ Menu',()=>choosePage('menu')),mapTitle,mapInfo);regions.append(mapArt);map.append(mapHeader,regions,mapActions);
 const merchantHeader=E('div','fw-live-merchant-banner'),coinLabel=E('b','fw-live-coin-label');merchantHeader.append(E('span','fw-live-emblem','✦'),E('div',null,'The Merchant · finite stock'),coinLabel);
 const prepSpells=E('div','fw-live-prep-spells');
 const stall=E('div','fw-merchant-art'),merchantArt=canvas(96,116,'fw-pixel-background');art.merchant(merchantArt);stall.append(merchantArt,E('p',null,'“Stock is limited, traveller. Choose wisely.”'));merchantHeader.prepend(btn('‹ Map',()=>choosePage('map')));shop.append(merchantHeader,stall,merchant,prepSpells,encounter,pool);
 dev.append(btn('‹ Map',()=>choosePage('map')),test,quest,tree,log);
 const deployment=E('div','fw-live-deployment');deployment.hidden=true;deployment.setAttribute('role','status');$('arena').parentElement.append(deployment);
 const battleControls=$('liveBattleControls'),abandon=$('abandonButton'),speed=btn('1×',()=>{ui.changeSpeed?.();speed.textContent=(live.playbackSpeed||1)+'×'});abandon.addEventListener('click',()=>ui.abandon?.());battleControls.prepend(speed);const hud=E('div','fw-pixel-hud'),hp=E('b'),earned=E('b'),meter=E('progress');meter.max=100;hud.append(hp,meter,earned);field.prepend(hud);
 const roster=E('div','fw-live-roster'),portrait=E('div','fw-live-portrait'),rosterButtons=E('div','fw-live-roster-buttons'),glyph=canvas(72,96,'fw-portrait-art'),heroName=E('h3'),heroDetail=E('p'),health=E('progress'),rescue=btn('Rescue',()=>{if(selected!=null)ui.press?.(selected)});
 health.max=100;health.value=0;portrait.append(glyph,heroName,heroDetail,health,rescue);roster.append(E('small','fw-portrait-heading','HERO INSPECTION'),portrait,rosterButtons);
 const formation=$('formation');roster.append(formation);roster.append($('formationCount'));side.append(roster);
 // Keep all original nodes and their listeners; only change where they are presented.
 const battleActions=$('battleActions'),canvasWrap=$('arena').parentElement;
 const buttons={};for(const [page,label] of [['menu','Menu'],['map','Realm'],['shop','Merchant'],['dev','Testing & log']]){buttons[page]=btn(label,()=>choosePage(page));nav.append(buttons[page])}
 buttons.tree=btn('Upgrades',()=>skill('skillTreeTab'));buttons.collection=btn('Collection',()=>skill('skillSkinsTab'));nav.append(buttons.tree,buttons.collection);
 pages.append(menu,map,shop,dev);shell.insertBefore(nav,layout);shell.insertBefore(pages,layout);
 ui={...ui,shell,layout,field,side,menu,map,shop,dev,buttons,mapInfo,regions,mapArt,mapActions,coinLabel,hud,hp,earned,meter,speed,battleControls,abandon,deployment,roster,rosterButtons,portrait,glyph,heroName,heroDetail,health,rescue,prepSpells,battleActions,canvasWrap,test,merchant};
 shell.classList.add('fw-live');document.body.classList.add('fw-live-body');installed=true;return true;
}
function renderMap(){
 const p=window.FWSkillTree.debug(),end=window.FWSkillTree.endlessState(),data=window.FWGameData.ENCOUNTERS;
 const key=JSON.stringify([live.stage,live.endlessWave,live.endlessHub,p.runClears,p.up,p.shards,p.resets,end.deepest]);
 if(mapKey===key)return;mapKey=key;
 ui.mapInfo.textContent=p.resets+' prestiges · '+p.up.toFixed(2)+' UP · '+p.shards.toFixed(2)+' Shards · '+(live.endlessHub?'Campaign complete':live.endlessWave?'Endless wave '+live.endlessWave:'Stage '+live.stage+' / 10');
 const count=live.endlessHub||live.endlessWave?10:Math.min(10,Math.max(1,live.stage));art.map(ui.mapArt,count);ui.regions.replaceChildren(ui.mapArt,...data.slice(0,count).map((r,i)=>{
  const n=i+1,cleared=p.runClears.includes(n),current=!live.endlessWave&&!live.endlessHub&&live.stage===n;
  const b=btn('',()=>choosePage('shop'));b.classList.add('fw-live-region');const pos=art.coords[i];b.style.left=pos[0]+'%';b.style.top=pos[1]+'%';b.append(E('span','fw-region-mark',icons[i]),E('b',null,r.name),E('small',null,current?'CURRENT':cleared?'CLEARED':'DISCOVERED'));b.disabled=!current;b.dataset.state=current?'current':cleared?'cleared':'locked';return b;
 }));
 ui.mapActions.firstElementChild.textContent=live.endlessHub?'Endless & progression':live.endlessWave?'Prepare Endless wave':'Prepare attempt';
}
function renderRoster(){
 const list=live.heroes.filter(h=>!h.summonKind&&(h.hp>0||h.capture));
 lastCapture=live.selectedCapture;
 if(!list.some(h=>h.id===selected))selected=list[0]?.id??null;
 const key=list.map(h=>h.id+':'+(h.capture?'capture':'active')+':'+h.skin?.id).join('|')+'/'+selected;
 if(key!==rosterKey){rosterKey=key;ui.rosterButtons.replaceChildren(...list.map(h=>{const b=btn(h.base.glyph+' '+h.base.name,()=>{selected=h.id;rosterKey='';renderRoster()});b.setAttribute('aria-pressed',String(h.id===selected));return b}))}
 const h=list.find(h=>h.id===selected);ui.portrait.hidden=!h;
 if(!h){ui.rescue.hidden=true;return}
 const damage=h.capture||h.hp/h.maxHp<=.33?2:h.hp/h.maxHp<=.66?1:0;const pk=[h.id,h.skin?.id,damage,!!h.capture].join(':');if(pk!==portraitKey){portraitKey=pk;art.portrait(ui.glyph,h.base.id,h.skin?.key==='default'?'Base':h.skin?.rarity,damage,!!h.capture,true,h.skin?.color);ui.glyph.style.borderColor=h.skin?.trim||h.base.color;ui.glyph.classList.toggle('fw-restrained',!!h.capture)}ui.heroName.textContent=h.base.name+' · '+(h.skin?.rarity||h.base.rarity);
 const c=h.capture;
 ui.heroDetail.textContent=c?(c.required?'Capture · '+Math.floor(c.progress)+' / '+c.required+' rescue taps':'Capture · no rescues remaining')+' · '+Math.max(0,c.expires-live.elapsed).toFixed(1)+'s':Math.ceil(h.hp)+' / '+h.maxHp+' HP · '+(h.skin?.name||'Base skin')+' · '+h.base.role;
 ui.health.value=c?(c.required?100*c.progress/c.required:0):100*Math.max(0,h.hp)/Math.max(1,h.maxHp);
 ui.rescue.hidden=!c;ui.rescue.disabled=!!live.paused||!c?.required;ui.rescue.textContent=c?'Rescue '+Math.floor(c.progress)+'/'+c.required:'Rescue';
}
function paint(){
 const combat=active(live);if(combat)screen='battle';
 ui.shell.dataset.screen=screen;
 for(const k of ['menu','map','shop','dev'])ui[k].hidden=screen!==k;
 ui.layout.hidden=!combat;ui.side.hidden=!combat;ui.shell.classList.toggle('fw-combat',combat);
 for(const [k,b] of Object.entries(ui.buttons)){b.disabled=!!combat;b.setAttribute('aria-current',k===screen?'page':'false')}
 ui.coinLabel.textContent='◈ '+live.coins+' / '+live.coinMax;ui.hp.textContent='♜ '+Math.ceil(live.towerHp)+' / '+(live.towerMax||100);ui.meter.value=100*live.towerHp/(live.towerMax||100);ui.earned.textContent='✦ '+Number(live.upEarned||0).toFixed(2)+' UP';ui.speed.textContent=(live.playbackSpeed||1)+'×';ui.battleControls.hidden=!combat||live.mode!=='battle';if(combat){ui.abandon.disabled=live.mode!=='battle';if(ui.battleActions.parentElement!==ui.field)ui.field.insertBefore(ui.battleActions,ui.canvasWrap);renderRoster()}
 else {if(ui.battleActions.parentElement!==ui.prepSpells)ui.prepSpells.append(ui.battleActions);renderMap()}
 // In testing, keep the actual controls available instead of making a second test state.
 if(!combat&&live.testMode&&screen==='shop')ui.shop.append(ui.test);else if(ui.test.parentElement!==ui.dev)ui.dev.prepend(ui.test);
}
function sync(state,press,abandon,newGame,view,resume,speed){
 live=state;ui.press=press;ui.abandon=abandon;ui.newGame=newGame;ui.view=view;ui.resume=resume;ui.changeSpeed=speed;if(!installed&&!install())return;
 if(previousMode&&previousMode!=='prep'&&state.mode==='prep'){screen=previousMode==='clear'||previousMode==='champion'?'map':'shop';selected=null;lastCapture=null;window.scrollTo?.(0,0)}
 const began=state.mode==='battle'&&previousMode!=='battle';previousMode=state.mode;paint();
 if(began){window.scrollTo?.(0,0);if(!state.testMode)deal(state)}
 else if(state.mode!=='battle'){clearTimeout(dealTimer);dealGeneration++;sealed=false;ui.deployment.hidden=true;ui.shell.classList.remove('fw-dealing')}
}
function deal(state){
 const generation=++dealGeneration,heroes=state.heroes.filter(h=>!h.summonKind);if(!heroes.length)return;
 state.paused=true;sealed=true;ui.shell.classList.add('fw-dealing');ui.deployment.hidden=false;ui.deployment.replaceChildren();
 const v=ui.view;for(const h of heroes){const pack=E('div','fw-field-pack','✦');pack.style.left=(50+h.x/v.worldW*100)+'%';pack.style.top=(50+h.y/v.worldH*100)+'%';pack.style.setProperty('--rar',h.skin?.trim||h.base.color);ui.deployment.append(pack)}
 const novel=[];for(const h of heroes){const k=h.base.id+':'+(h.skin?.id||'base');if(!knownBefore.has(h.base.id)||h.skin?.key!=='default'&&!seenAppearances.has(k)){novel.push(h);knownBefore.add(h.base.id)}seenAppearances.add(k)}
 try{localStorage.setItem('fw-ui-seen-appearances',JSON.stringify([...seenAppearances]))}catch{}
 const finish=()=>{if(generation!==dealGeneration||live.mode!=='battle')return;ui.deployment.hidden=true;ui.shell.classList.remove('fw-dealing');ui.resume?.()};
 const reveal=()=>{if(generation!==dealGeneration||live.mode!=='battle')return;sealed=false;ui.deployment.replaceChildren(...heroes.map(h=>{const x=E('div','fw-field-burst','✦');x.style.left=(50+h.x/v.worldW*100)+'%';x.style.top=(50+h.y/v.worldH*100)+'%';x.style.color=h.skin?.trim||h.base.color;return x}));dealTimer=setTimeout(()=>{if(generation!==dealGeneration)return;if(!novel.length){finish();return}showcase(novel,finish,generation)},450)};
 dealTimer=setTimeout(reveal,1200);
}
function showcase(novel,finish,generation){
 if(generation!==dealGeneration||live.mode!=='battle')return;if(!novel.length){finish();return}
 const h=novel.shift(),card=E('div','fw-discovery-card'),pic=canvas(72,96,'fw-portrait-art');
 art.portrait(pic,h.base.id,h.skin?.key==='default'?'Base':h.skin?.rarity,0,false,true,h.skin?.color);card.style.borderColor=h.skin?.trim||h.base.color;card.append(E('small',null,'DISCOVERY'),pic,E('h3',null,h.base.name),E('p',null,h.skin?.name+' · '+h.skin?.rarity));ui.deployment.replaceChildren(card);
 dealTimer=setTimeout(()=>showcase(novel,finish,generation),1500)

}
function beforeDeploy(){knownBefore=new Set(window.FWSkillTree.debug().discoveredHeroes||[])}
function inspect(id){if(!live||live.mode!=='battle'||id==null)return;if(selected!==id){selected=id;rosterKey='';renderRoster()}}
function prepareField(){if(!installed)return;ui.layout.hidden=false;ui.side.hidden=false;ui.shell.classList.add('fw-combat');ui.shell.dataset.screen='battle';}
function resetAppearanceHistory(){seenAppearances.clear();try{localStorage.removeItem('fw-ui-seen-appearances')}catch{}}
window.FWCampaignUI={sync,prepareField,inspect,beforeDeploy,resetAppearanceHistory,isDealing:()=>!!ui.shell?.classList.contains('fw-dealing'),isPackSealed:()=>sealed};
})();