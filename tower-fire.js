/* Build 1.0.14 — player-aimed automatic tower bolts.
   Real screen coordinates map to world units. Neither mouse motion nor touch clicks
   damage enemies directly: the tower fires on its own cooldown and bolts travel physically. */
(function(){'use strict';
window.FWTowerFire={
 create({canvas,ctx,view,state,config,hitEnemy,addEffect}){
  const cfg={...config};
  if(!cfg||!Number.isFinite(cfg.projectileSpeed)||cfg.projectileSpeed<=0)throw Error('Missing tower-fire config');
  const radius=cfg.projectileRadius;
  if(!state.towerAim)state.towerAim={x:0,y:-5};
  if(!state.towerShots)state.towerShots=[];
  let clock=0,serial=0;
  const px=x=>view.w/2+x*view.scale, py=y=>view.h/2+y*view.scale;
  function aim(clientX,clientY){
   const rect=canvas.getBoundingClientRect();
   if(!rect.width||!rect.height)return;
   const x=(clientX-rect.left)/rect.width*view.w, y=(clientY-rect.top)/rect.height*view.h;
   state.towerAim={x:Math.max(-view.worldW/2,Math.min(view.worldW/2,(x-view.w/2)/view.scale)),
                    y:Math.max(-view.worldH/2,Math.min(view.worldH/2,(y-view.h/2)/view.scale))};
  }
  canvas.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')aim(e.clientX,e.clientY)});
  canvas.addEventListener('pointerdown',e=>{aim(e.clientX,e.clientY)});
  function fire(){
   const dx=state.towerAim.x,dy=state.towerAim.y,len=Math.hypot(dx,dy)||1;
   const vx=dx/len,vy=dy/len;
   state.towerShots.push({id:++serial,x:vx*.95,y:vy*.95,vx,vy,damage:cfg.damage,travel:0});
   addEffect({kind:'pulse',x:0,y:0,radius:.55,color:'#ffe19b',life:.15,maxLife:.15});
  }
  function step(dt){
   if(state.mode!=='battle'||state.paused)return;
   clock+=dt;
   while(clock>=cfg.cooldownSeconds){clock-=cfg.cooldownSeconds;fire();}
   for(let i=state.towerShots.length-1;i>=0;i--){
    const b=state.towerShots[i],oldX=b.x,oldY=b.y,dist=cfg.projectileSpeed*dt;
    b.x+=b.vx*dist;b.y+=b.vy*dist;b.travel+=dist;
    let chosen=null,nearest=Infinity;
    for(const e of state.enemies){
     if(e.hp<=0)continue;
     const dx=b.x-oldX,dy=b.y-oldY,denom=dx*dx+dy*dy||1;
     const t=Math.max(0,Math.min(1,((e.x-oldX)*dx+(e.y-oldY)*dy)/denom));
     const x=oldX+dx*t,y=oldY+dy*t;
     if(Math.hypot(e.x-x,e.y-y)<=radius+(e.radius||.35)&&t<nearest){nearest=t;chosen=e;}
    }
    if(chosen){
     hitEnemy(chosen,b.damage,'#ffdfa1',null);
     addEffect({kind:'pulse',x:chosen.x,y:chosen.y,radius:.38,color:'#fbd48d',life:.20,maxLife:.20});
     state.towerShots.splice(i,1);
    }else if(b.travel>Math.max(view.worldW,view.worldH)+5||Math.abs(b.x)>view.worldW/2+1||Math.abs(b.y)>view.worldH/2+1){
     state.towerShots.splice(i,1);
    }
   }
  }
  function draw(){
   if(state.mode==='battle'){
    for(const b of state.towerShots){
     const x=px(b.x),y=py(b.y);
     ctx.save();ctx.shadowColor='#ffbd67';ctx.shadowBlur=11;
     ctx.fillStyle='#ffedbd';ctx.beginPath();ctx.arc(x,y,Math.max(3,radius*view.scale*.75),0,Math.PI*2);ctx.fill();ctx.restore();
    }
    if(!state.paused){
     const x=px(state.towerAim.x),y=py(state.towerAim.y),r=Math.max(8,view.scale*.28);
     ctx.save();ctx.strokeStyle='#ffefbcaa';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
     ctx.moveTo(x-r-5,y);ctx.lineTo(x-r+4,y);ctx.moveTo(x+r-4,y);ctx.lineTo(x+r+5,y);
     ctx.moveTo(x,y-r-5);ctx.lineTo(x,y-r+4);ctx.moveTo(x,y+r-4);ctx.lineTo(x,y+r+5);ctx.stroke();ctx.restore();
    }
   }
  }
  function reset(){clock=0;state.towerShots=[];}
  return {step,draw,reset,fire,aim,config:cfg};
 }
};
})();
