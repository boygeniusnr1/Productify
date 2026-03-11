function p(e,d){const a=d.filter(t=>t.parentId===e.id),n=new Date().toISOString().split("T")[0],r=!e.completed&&e.type==="today"&&e.dateAssigned<n;return`
    <div class="group border-b border-gray-800/50 last:border-0 py-4" data-id="${e.id}">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <input type="checkbox" ${e.completed?"checked":""} class="toggle-btn w-5 h-5 rounded border-gray-700 bg-gray-800 text-accent cursor-pointer" data-id="${e.id}">
          <span class="font-medium truncate ${e.completed?"line-through text-gray-600":r?"text-red-400":"text-gray-200"}">
            ${r?'<span class="text-[10px] bg-red-500/20 text-red-500 px-1 rounded mr-1 font-bold">OVERDUE</span>':""}
            ${e.text}
          </span>
        </div>
        
        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          ${e.type!=="long-term"?`<button class="move-backlog-btn text-[9px] font-bold uppercase bg-gray-800 hover:bg-gray-600 px-2 py-1 rounded" data-id="${e.id}">Backlog</button>`:""}
          ${e.type!=="today"?`<button class="move-today-btn text-[9px] font-bold uppercase bg-gray-800 hover:bg-accent hover:text-black px-2 py-1 rounded" data-id="${e.id}">Today</button>`:""}
          ${e.type!=="tomorrow"?`<button class="move-tomorrow-btn text-[9px] font-bold uppercase bg-gray-800 hover:bg-blue-600 px-2 py-1 rounded" data-id="${e.id}">Tmrw</button>`:""}
          <button class="sub-btn text-[9px] font-bold uppercase bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" data-id="${e.id}">+ Sub</button>
          <button class="delete-btn text-[9px] font-bold uppercase bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded" data-id="${e.id}">✕</button>
        </div>
      </div>

      ${a.length>0?`
        <div class="ml-9 mt-3 space-y-2 border-l border-gray-800 pl-4">
          ${a.map(t=>`
            <div class="flex items-center justify-between group/sub">
              <div class="flex items-center gap-2 text-sm">
                <input type="checkbox" ${t.completed?"checked":""} class="toggle-btn w-4 h-4 rounded border-gray-700 bg-gray-800 text-accent" data-id="${t.id}">
                <span class="${t.completed?"line-through text-gray-600":"text-gray-400"}">${t.text}</span>
              </div>
              <button class="delete-btn opacity-0 group-hover/sub:opacity-100 text-[8px] text-red-500 px-1" data-id="${t.id}">✕</button>
            </div>
          `).join("")}
        </div>
      `:""}
    </div>
  `}export{p as r};
