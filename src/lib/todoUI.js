export function renderTodo(todo, allTodos) {
  const subtasks = allTodos.filter((t) => t.parentId === todo.id);
  const today = new Date().toISOString().split("T")[0];
  const isOverdue =
    !todo.completed && todo.type === "today" && todo.dateAssigned < today;

  return `
    <div class="group border-b border-gray-800/50 last:border-0 py-4" data-id="${todo.id}">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <input type="checkbox" ${todo.completed ? "checked" : ""} class="toggle-btn w-5 h-5 rounded border-gray-700 bg-gray-800 text-accent cursor-pointer" data-id="${todo.id}">
          <span class="font-medium truncate ${todo.completed ? "line-through text-gray-600" : isOverdue ? "text-red-400" : "text-gray-200"}">
            ${isOverdue ? `<span class="text-[10px] bg-red-500/20 text-red-500 px-1 rounded mr-1 font-bold">OVERDUE</span>` : ""}
            ${todo.text}
          </span>
        </div>
        
        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          ${todo.type !== "long-term" ? `<button class="move-backlog-btn text-[9px] font-bold uppercase bg-gray-800 hover:bg-gray-600 px-2 py-1 rounded" data-id="${todo.id}">Backlog</button>` : ""}
          ${todo.type !== "today" ? `<button class="move-today-btn text-[9px] font-bold uppercase bg-gray-800 hover:bg-accent hover:text-black px-2 py-1 rounded" data-id="${todo.id}">Today</button>` : ""}
          ${todo.type !== "tomorrow" ? `<button class="move-tomorrow-btn text-[9px] font-bold uppercase bg-gray-800 hover:bg-blue-600 px-2 py-1 rounded" data-id="${todo.id}">Tmrw</button>` : ""}
          <button class="sub-btn text-[9px] font-bold uppercase bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" data-id="${todo.id}">+ Sub</button>
          <button class="delete-btn text-[9px] font-bold uppercase bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded" data-id="${todo.id}">✕</button>
        </div>
      </div>

      ${
        subtasks.length > 0
          ? `
        <div class="ml-9 mt-3 space-y-2 border-l border-gray-800 pl-4">
          ${subtasks
            .map(
              (st) => `
            <div class="flex items-center justify-between group/sub">
              <div class="flex items-center gap-2 text-sm">
                <input type="checkbox" ${st.completed ? "checked" : ""} class="toggle-btn w-4 h-4 rounded border-gray-700 bg-gray-800 text-accent" data-id="${st.id}">
                <span class="${st.completed ? "line-through text-gray-600" : "text-gray-400"}">${st.text}</span>
              </div>
              <button class="delete-btn opacity-0 group-hover/sub:opacity-100 text-[8px] text-red-500 px-1" data-id="${st.id}">✕</button>
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
    </div>
  `;
}
