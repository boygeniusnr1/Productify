import{l,d as a,c as n}from"./logStore.Dgx_XZV0.js";const e=document.getElementById("log-table-body");l.subscribe(o=>{if(!e)return;const r=[...o].reverse();e.innerHTML=r.map(t=>`
    <tr class="border-t border-gray-800 hover:bg-gray-800/50 transition-colors">
      <td class="px-6 py-4 font-bold text-gray-100">${t.activity||"Focus Session"}</td>
      <td class="px-6 py-4 font-mono text-accent text-sm">${t.duration}</td>
      <td class="px-6 py-4 text-xs text-gray-500">${t.timestamp}</td>
      <td class="px-6 py-4 text-right">
        <button data-id="${t.id}" class="delete-log-btn text-gray-600 hover:text-red-500 transition-colors">
          <span class="material-symbols-rounded">delete</span>
        </button>
      </td>
    </tr>
  `).join(""),e.querySelectorAll(".delete-log-btn").forEach(t=>{t.onclick=()=>{const s=t.getAttribute("data-id");confirm("Delete this log entry forever?")&&a(s)}})});const c=document.getElementById("clear-all-btn");c.onclick=()=>{confirm("This will permanently wipe your entire cloud history. Proceed?")&&n()};
