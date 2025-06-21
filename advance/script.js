document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const categorySelect = document.getElementById("taskCategory");
  const themeToggle = document.getElementById("toggleTheme");

  loadTasks();

  addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const category = categorySelect.value;
    if (!text || isDuplicateTask(text)) return;

    const task = { text, completed: false, category };
    createTaskElement(task);
    saveTask(task);
    taskInput.value = "";
  });

  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
  });

  function isDuplicateTask(text) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return tasks.some(task => task.text === text);
  }

  function createTaskElement(task) {
    const li = document.createElement("li");
    li.classList.add(`category-${task.category}`);
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      li.classList.toggle("completed");
      task.completed = !task.completed;
      updateStorage();
    });

    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;
    textSpan.contentEditable = false;

    const controls = document.createElement("div");
    controls.className = "task-controls";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.className = "edit";
    editBtn.onclick = () => {
      if (!textSpan.isContentEditable) {
        textSpan.contentEditable = true;
        textSpan.focus();
      } else {
        textSpan.contentEditable = false;
        task.text = textSpan.textContent.trim();
        updateStorage();
      }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.className = "delete";
    deleteBtn.onclick = () => {
      li.remove();
      removeTask(task);
    };

    controls.append(editBtn, deleteBtn);
    li.append(checkbox, textSpan, controls);
    taskList.appendChild(li);
  }

  function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateStorage() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(li => {
      const text = li.querySelector(".task-text").textContent.trim();
      const completed = li.classList.contains("completed");
      const category = li.classList.contains("category-urgent")
        ? "urgent"
        : li.classList.contains("category-personal")
        ? "personal"
        : "work";

      tasks.push({ text, completed, category });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function removeTask(taskToRemove) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.text !== taskToRemove.text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(createTaskElement);
  }
});
