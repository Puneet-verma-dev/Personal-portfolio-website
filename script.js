
/* ---- NAV scroll ---- */
window.addEventListener('scroll',()=>document.getElementById('main-nav').classList.toggle('scrolled',scrollY>60));

/* ---- Fade in ---- */
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('visible')}),{threshold:.1});
document.querySelectorAll('.fade-in').forEach(el=>io.observe(el));

/* ---- Skill bars ---- */
const bo=new IntersectionObserver(e=>{
  e.forEach(x=>{
    if(x.isIntersecting){
      x.target.querySelectorAll('.skill-bar-fill').forEach(b=>b.style.width=b.dataset.w+'%');
      bo.unobserve(x.target);
    }
  });
},{threshold:.2});
bo.observe(document.getElementById('skills-grid'));

/* ================================================================
   MINI TO-DO
================================================================ */
const miniTasks=[
  {t:'Build portfolio website',d:true},
  {t:'Push to GitHub Pages',d:false},
  {t:'Apply to 5 jobs today',d:false},
];
function renderMini(){
  const el=document.getElementById('mini-list');
  if(!el)return;
  el.innerHTML=miniTasks.slice(0,4).map((t,i)=>`
    <div onclick="miniToggle(${i})" style="display:flex;align-items:center;gap:.55rem;cursor:pointer;padding:.38rem .5rem;background:#1a1a1a;border:1px solid #fff0d;user-select:none" onmouseover="this.style.background='#222'" onmouseout="this.style.background='#1a1a1a'">
      <div style="width:13px;height:13px;border:1px solid ${t.d?'#E24B4A':'#fff3'};background:${t.d?'#E24B4A':'transparent'};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff">${t.d?'✓':''}</div>
      <span style="font-family:monospace;font-size:.6rem;opacity:${t.d?.3:.75};text-decoration:${t.d?'line-through':'none'};overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${t.t}</span>
    </div>`).join('');
}
window.miniToggle=i=>{miniTasks[i].d=!miniTasks[i].d;renderMini()};
window.miniAdd=()=>{
  const inp=document.getElementById('mini-inp');
  const v=inp.value.trim();if(!v)return;
  miniTasks.unshift({t:v,d:false});inp.value='';renderMini();
};
document.getElementById('mini-inp')?.addEventListener('keydown',e=>{if(e.key==='Enter')miniAdd()});
renderMini();

/* ================================================================
   MINI CALCULATOR
================================================================ */
(function(){
  const rows=[['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+']];
  const g=document.getElementById('cgrid');
  if(!g)return;
  rows.forEach(r=>r.forEach(k=>{
    const b=document.createElement('button');
    b.textContent=k;
    const op=['÷','×','−','+'].includes(k);
    b.style.cssText=`background:${op?'#E24B4A22':k==='C'?'#ffffff14':'#1c1c1c'};color:${op?'#E24B4A':'#f5f0e8'};border:1px solid ${op?'#E24B4A33':'#fff1'};font-family:monospace;font-size:.65rem;padding:.48rem 0;cursor:pointer`;
    b.onmouseover=()=>b.style.filter='brightness(1.35)';
    b.onmouseout=()=>b.style.filter='';
    b.onclick=()=>cp(k);
    g.appendChild(b);
  }));
  // last row: 0 (span2), . , =
  [['0',true],['.'],['=']].forEach(([k,s])=>{
    const b=document.createElement('button');
    b.textContent=k;if(s)b.style.gridColumn='span 2';
    b.style.cssText=`background:${k==='='?'#E24B4A':'#1c1c1c'};color:#f5f0e8;border:1px solid #fff1;font-family:monospace;font-size:.65rem;padding:.48rem 0;cursor:pointer`;
    b.onmouseover=()=>b.style.filter='brightness(1.35)';
    b.onmouseout=()=>b.style.filter='';
    b.onclick=()=>cp(k);
    g.appendChild(b);
  });

  let disp='0',prev=null,op=null,fresh=false;
  window.cp=k=>{
    const d=document.getElementById('cdisplay');if(!d)return;
    if(k==='C'){disp='0';prev=null;op=null;fresh=false;}
    else if(k==='±'){disp=String(-parseFloat(disp));}
    else if(k==='%'){disp=String(parseFloat(disp)/100);}
    else if(['÷','×','−','+'].includes(k)){prev=parseFloat(disp);op=k;fresh=true;}
    else if(k==='='){
      if(op&&prev!==null){const c=parseFloat(disp),m={'÷':prev/c,'×':prev*c,'−':prev-c,'+':prev+c};disp=String(parseFloat(m[op].toFixed(8)));op=null;prev=null;fresh=false;}
    }else if(k==='.'){
      if(fresh){disp='0.';fresh=false;}else if(!disp.includes('.'))disp+='.';
    }else{
      if(disp==='0'||fresh){disp=k;fresh=false;}else if(disp.length<9)disp+=k;
    }
    d.textContent=disp.length>9?parseFloat(parseFloat(disp).toFixed(6)):disp;
  };
})();

/* ================================================================
   MODAL DEMOS
================================================================ */
const catC={work:'#378ADD',personal:'#97C459',code:'#E24B4A'};
let modalTasks=[
  {t:'Set up portfolio on GitHub Pages',c:'code',d:true},
  {t:'Update LinkedIn profile',c:'personal',d:false},
  {t:'Build a React project',c:'code',d:false},
  {t:'Apply to 5 jobs today',c:'work',d:false},
  {t:'Learn about REST APIs',c:'code',d:false},
  {t:'Practise CSS Grid layouts',c:'code',d:false},
];

function renderModalTasks(){
  const list=document.getElementById('m-list');
  const filter=document.getElementById('m-filter')?.value||'all';
  if(!list)return;
  const vis=filter==='all'?modalTasks:modalTasks.filter(t=>t.c===filter);
  list.innerHTML=vis.length===0
    ?`<div style="text-align:center;opacity:.3;font-family:monospace;font-size:.75rem;margin-top:3rem">No tasks here.</div>`
    :vis.map(t=>{
      const i=modalTasks.indexOf(t);
      return `<div onclick="mToggle(${i})" style="display:flex;align-items:center;gap:1rem;padding:.8rem 1rem;background:#1a1a1a;border:1px solid ${t.d?'#ffffff09':'#ffffff0d'};cursor:pointer;opacity:${t.d?.45:1};transition:all .15s" onmouseover="this.style.borderColor='#ffffff1e'" onmouseout="this.style.borderColor='${t.d?'#ffffff09':'#ffffff0d'}'">
        <div style="width:16px;height:16px;border:1.5px solid ${t.d?'#E24B4A':'#fff3'};background:${t.d?'#E24B4A':'transparent'};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;transition:all .2s">${t.d?'✓':''}</div>
        <span style="flex:1;font-family:monospace;font-size:.78rem;text-decoration:${t.d?'line-through':'none'}">${t.t}</span>
        <span style="font-family:monospace;font-size:.58rem;color:${catC[t.c]};background:${catC[t.c]}18;padding:.2rem .6rem;letter-spacing:1px;text-transform:uppercase">${t.c}</span>
        <button onclick="event.stopPropagation();mDel(${i})" style="background:none;border:none;color:#fff;opacity:.2;cursor:pointer;font-size:.9rem;transition:opacity .2s;line-height:1" onmouseover="this.style.opacity=.8" onmouseout="this.style.opacity=.2">✕</button>
      </div>`;
    }).join('');
  const dn=modalTasks.filter(t=>t.d).length;
  const cnt=document.getElementById('m-count');
  if(cnt)cnt.textContent=`${dn}/${modalTasks.length} done`;
}
window.mToggle=i=>{modalTasks[i].d=!modalTasks[i].d;renderModalTasks()};
window.mDel=i=>{modalTasks.splice(i,1);renderModalTasks()};

let mD='0',mP=null,mO=null,mF=false,mH='';
function mPress(k){
  const d=document.getElementById('m-disp');const h=document.getElementById('m-hist');if(!d)return;
  if(k==='C'){mD='0';mP=null;mO=null;mF=false;mH='';}
  else if(k==='±'){mD=String(-parseFloat(mD));}
  else if(k==='%'){mD=String(parseFloat(mD)/100);}
  else if(['÷','×','−','+'].includes(k)){mP=parseFloat(mD);mO=k;mF=true;mH=mD+' '+k;}
  else if(k==='='){
    if(mO&&mP!==null){const c=parseFloat(mD),m={'÷':mP/c,'×':mP*c,'−':mP-c,'+':mP+c};mH=mH+' '+mD+' =';mD=String(parseFloat(m[mO].toFixed(8)));mO=null;mP=null;mF=false;}
  }else if(k==='.'){
    if(mF){mD='0.';mF=false;}else if(!mD.includes('.'))mD+='.';
  }else{if(mD==='0'||mF){mD=k;mF=false;}else if(mD.length<12)mD+=k;}
  d.textContent=mD.length>12?parseFloat(parseFloat(mD).toFixed(8)):mD;
  if(h)h.textContent=mH;
}

const demoData={
  todo:{
    label:'// To-Do App — Live Demo',
    html:`<div style="background:#0d0d0d;min-height:520px;padding:2rem;display:flex;flex-direction:column;gap:1.2rem">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem">
        <h2 style="font-family:monospace;font-size:.95rem;letter-spacing:3px;color:#E24B4A">// MY TASKS</h2>
        <span id="m-count" style="font-family:monospace;font-size:.68rem;opacity:.35"></span>
      </div>
      <div style="display:flex;gap:.6rem;flex-wrap:wrap">
        <input id="m-inp" placeholder="What needs to be done?" style="flex:1;min-width:180px;background:#1a1a1a;border:1px solid #fff2;color:#f5f0e8;font-family:monospace;font-size:.76rem;padding:.55rem .9rem;outline:none"/>
        <select id="m-cat" style="background:#1a1a1a;border:1px solid #fff2;color:#f5f0e8;font-family:monospace;font-size:.72rem;padding:.55rem .8rem;outline:none;cursor:pointer">
          <option value="work">Work</option><option value="personal">Personal</option><option value="code">Code</option>
        </select>
        <button id="m-add" style="background:#E24B4A;border:none;color:#fff;font-family:monospace;font-size:.76rem;padding:.55rem 1.4rem;cursor:pointer;letter-spacing:1px">+ ADD</button>
      </div>
      <div style="display:flex;gap:.6rem">
        <select id="m-filter" onchange="renderModalTasks()" style="background:#1a1a1a;border:1px solid #fff2;color:#f5f0e8;font-family:monospace;font-size:.7rem;padding:.4rem .8rem;outline:none;cursor:pointer">
          <option value="all">All Tasks</option><option value="work">Work</option><option value="personal">Personal</option><option value="code">Code</option>
        </select>
      </div>
      <div id="m-list" style="display:flex;flex-direction:column;gap:.55rem;min-height:220px;overflow-y:auto"></div>
    </div>`,
    init(){
      document.getElementById('m-add')?.addEventListener('click',()=>{
        const inp=document.getElementById('m-inp');const cat=document.getElementById('m-cat')?.value||'work';
        const v=inp?.value.trim();if(!v)return;
        modalTasks.unshift({t:v,c:cat,d:false});inp.value='';renderModalTasks();
      });
      document.getElementById('m-inp')?.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('m-add')?.click()});
      renderModalTasks();
    }
  },
  calc:{
    label:'// JavaScript Calculator — Live Demo',
    html:`<div style="background:#0d0d0d;min-height:520px;display:flex;align-items:center;justify-content:center;padding:3rem">
      <div style="background:#141414;border:1px solid #fff1;width:340px">
        <div id="m-hist" style="padding:.6rem 1.2rem;font-family:monospace;font-size:.65rem;opacity:.28;text-align:right;min-height:1.6rem"></div>
        <div id="m-disp" style="background:#0a0a0a;border-top:1px solid #fff1;text-align:right;padding:1.2rem 1.4rem;font-family:monospace;font-size:2.4rem;font-weight:700;min-height:5rem;display:flex;align-items:center;justify-content:flex-end;overflow:hidden">0</div>
        <div id="m-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#fff1"></div>
      </div>
    </div>`,
    init(){
      const rows=[
        [{k:'C',s:'dim'},{k:'±',s:'dim'},{k:'%',s:'dim'},{k:'÷',s:'op'}],
        [{k:'7'},{k:'8'},{k:'9'},{k:'×',s:'op'}],
        [{k:'4'},{k:'5'},{k:'6'},{k:'−',s:'op'}],
        [{k:'1'},{k:'2'},{k:'3'},{k:'+',s:'op'}],
      ];
      const g=document.getElementById('m-grid');if(!g)return;
      rows.forEach(r=>r.forEach(({k,s})=>{
        const b=document.createElement('button');b.textContent=k;
        b.style.cssText=`padding:1.2rem 0;font-family:monospace;font-size:1.05rem;border:none;cursor:pointer;background:${s==='op'?'#E24B4A1a':s==='dim'?'#1e1e1e':'#161616'};color:${s==='op'?'#E24B4A':'#f5f0e8'};transition:filter .1s`;
        b.onmouseover=()=>b.style.filter='brightness(1.4)';b.onmouseout=()=>b.style.filter='';
        b.onclick=()=>mPress(k);g.appendChild(b);
      }));
      [['0',true],['.',false],['=',false]].forEach(([k,s2])=>{
        const b=document.createElement('button');b.textContent=k;
        if(s2)b.style.gridColumn='span 2';
        b.style.cssText=`padding:1.2rem 0;font-family:monospace;font-size:1.05rem;border:none;cursor:pointer;background:${k==='='?'#E24B4A':'#161616'};color:#f5f0e8;transition:filter .1s`;
        b.onmouseover=()=>b.style.filter='brightness(1.35)';b.onmouseout=()=>b.style.filter='';
        b.onclick=()=>mPress(k);g.appendChild(b);
      });
      // keyboard
      const kh=e=>{
        const map={'Enter':'=','Backspace':'C','Escape':'C','*':'×','/':'÷','-':'−'};
        const k=map[e.key]||e.key;
        if('0123456789.+-=C'.includes(k)||['÷','×','−','%'].includes(k))mPress(k);
      };
      document.addEventListener('keydown',kh);
      document._calcKH=kh;
    }
  }
};

window.openDemo=function(key){
  const d=demoData[key];if(!d)return;
  document.getElementById('modal-lbl').textContent=d.label;
  document.getElementById('modal-body').innerHTML=d.html;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow='hidden';
  setTimeout(()=>d.init&&d.init(),60);
};
window.closeModal=function(){
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow='';
  if(document._calcKH){document.removeEventListener('keydown',document._calcKH);document._calcKH=null;}
};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
