import{e as o,d as c,a as m}from"./exerciseStore.DEBKjy7C.js";const n=document.getElementById("manage-list"),s=document.getElementById("add-ex-btn"),d=document.getElementById("ex-name"),l=document.getElementById("ex-goal");o.subscribe(t=>{n&&(n.innerHTML=t.map(e=>`
      <div class="flex items-center justify-between bg-gray-900/50 p-5 rounded-3xl border border-gray-800 hover:border-gray-700 transition-colors">
        <div>
          <h3 class="font-bold text-lg text-white">${e.name}</h3>
          <p class="text-xs text-gray-500 uppercase tracking-widest">Target: ${e.goal} reps</p>
        </div>
        <button data-id="${e.id}" class="delete-btn p-3 text-gray-600 hover:text-red-500 transition-colors flex items-center justify-center">
          <span class="material-symbols-rounded">delete</span>
        </button>
      </div>
    `).join(""),n.querySelectorAll(".delete-btn").forEach(e=>{e.onclick=async()=>{const a=e.getAttribute("data-id"),r=t.find(i=>i.id===a)?.name;a&&confirm(`Delete "${r}" and all its cloud data?`)&&await c(a)}}))});s&&(s.onclick=()=>{const t=d.value.trim(),e=parseInt(l.value);t&&e>0?(m(t,e),d.value="",l.value=""):alert("Please enter a valid name and goal.")});
