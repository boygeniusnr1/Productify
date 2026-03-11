import{e as m,i as p}from"./exerciseStore.DEBKjy7C.js";import{l as f}from"./logStore.Dgx_XZV0.js";import{t as d,b as g,d as y,m as a,a as v}from"./todoStore.CeFlT1eC.js";import{r as b}from"./todoUI.hh2tZ6vO.js";const i=document.getElementById("exercise-list-container"),c=document.getElementById("activity-log-container"),r=document.getElementById("dashboard-todo-container");m.subscribe(e=>{i&&(i.innerHTML=e.map(t=>{const o=Math.min((t.current||0)/(t.goal||1)*100,100);return`
        <div class="group">
          <div class="flex justify-between items-end mb-2">
            <span class="font-bold text-lg text-gray-200">${t.name}</span>
            <div class="flex items-center gap-4">
               <span class="font-mono text-sm text-gray-400">${t.current} / ${t.goal}</span>
               <button data-id="${t.id}" class="inc-btn bg-gray-800 hover:bg-accent size-8 rounded-lg flex items-center justify-center transition-all active:scale-90 text-white font-bold">+</button>
            </div>
          </div>
          <div class="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div class="h-full transition-all duration-500" style="width: ${o}%; background-color: var(--accent);"></div>
          </div>
        </div>`}).join(""),i.querySelectorAll(".inc-btn").forEach(t=>{t.onclick=o=>p(o.currentTarget.dataset.id)}))});f.subscribe(e=>{if(!c)return;const t=[...e].reverse().slice(0,4);if(t.length===0){c.innerHTML='<p class="text-gray-600 text-sm italic">No recent sessions.</p>';return}c.innerHTML=t.map(o=>`
      <div class="flex justify-between items-center border-l-2 border-accent pl-4 py-1">
        <div>
          <p class="font-bold text-sm text-gray-200">${o.activity||"Session"}</p>
          <p class="text-[10px] text-gray-500 uppercase">${o.timestamp||"Recent"}</p>
        </div>
        <span class="font-mono text-accent font-bold text-xs">${o.duration}</span>
      </div>
    `).join("")});const x=e=>{e&&(e.querySelectorAll(".toggle-btn").forEach(t=>t.onclick=()=>g(t.dataset.id)),e.querySelectorAll(".delete-btn").forEach(t=>t.onclick=()=>y(t.dataset.id)),e.querySelectorAll(".move-today-btn").forEach(t=>t.onclick=()=>a(t.dataset.id,"today")),e.querySelectorAll(".move-tomorrow-btn").forEach(t=>t.onclick=()=>a(t.dataset.id,"tomorrow")),e.querySelectorAll(".move-backlog-btn").forEach(t=>t.onclick=()=>a(t.dataset.id,"long-term")),e.querySelectorAll(".sub-btn").forEach(t=>t.onclick=()=>{const o=prompt("Enter sub-task:");if(o){const n=d.get().find(s=>s.id===t.dataset.id);v(o,n.type,t.dataset.id)}}))};d.subscribe(e=>{if(!r)return;const t=new Date().toISOString().split("T")[0],o=e.filter(s=>s.type==="today"&&!s.parentId);if(o.length===0){r.innerHTML='<p class="text-gray-600 text-sm italic py-4">No tasks for today.</p>';return}const n=o.sort((s,l)=>{const u=!s.completed&&s.dateAssigned<t;return(!l.completed&&l.dateAssigned<t)-u});r.innerHTML=n.map(s=>b(s,e)).join(""),x(r)});
