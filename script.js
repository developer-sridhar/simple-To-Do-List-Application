console.log("Server In Live");

document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("new-task");
  const addTaskButton = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const viewTodayButton = document.getElementById("view-today");
  const viewAllButton = document.getElementById("view-all");
  const searchInput = document.querySelector(".search-bar");
  const toggleSidebarButton = document.getElementById("toggle-sidebar");
  const closeSidebarButton = document.getElementById("close-sidebar");
  const sidebar = document.getElementById("sidebar");

  // Load tasks from localStorage
  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks(tasks);
  };

  const saveTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const getAllTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];

  const addTaskToDOM = (task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <div class="task-details">
        <span class="task-text">${task.text}</span>
        <div class="task-date-time">Added: ${task.date} at ${task.time}</div>
        <div class="status-badge ${task.completed ? 'completed' : 'pending'}">
          ${task.completed ? 'Completed' : 'Pending'}
        </div>
      </div>
      <div class="task-btns">
        <button class="complete-btn">✓</button>
        <button class="delete-btn">✕</button>
      </div>
    `;

    taskList.appendChild(li);

    // Add event listener for "Complete" button
    li.querySelector(".complete-btn").addEventListener("click", () => {
      task.completed = !task.completed;
      li.classList.toggle("completed");
      const tasks = getAllTasks().map((t) =>
        t.text === task.text && t.date === task.date ? task : t
      );
      saveTasks(tasks);
      renderTasks(tasks);
    });

    // Add event listener for "Delete" button
    li.querySelector(".delete-btn").addEventListener("click", () => {
      const tasks = getAllTasks().filter(
        (t) => t.text !== task.text || t.date !== task.date
      );
      saveTasks(tasks);
      renderTasks(tasks); 
    });
  };

  const renderTasks = (tasks) => {
    taskList.innerHTML = "";
    tasks.forEach(addTaskToDOM);
  };

  const getCurrentDateAndTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // HH:MM
    return { date, time };
  };

  const addTask = () => {
    const taskText = taskInput.value.trim();

    if (taskText) {
      const { date, time } = getCurrentDateAndTime();
      const newTask = { text: taskText, date, time, completed: false };
      const tasks = getAllTasks();
      tasks.push(newTask);
      saveTasks(tasks);
      renderTasks(tasks);
      taskInput.value = "";
    }
  };

  const filterTasksByDate = (dateFilter) => {
    const tasks = getAllTasks();
    const today = new Date().toISOString().split("T")[0];
    const filteredTasks = tasks.filter((task) => {
      if (dateFilter === "today") return task.date === today;
      if (dateFilter === "upcoming") return task.date > today;
      return true;
    });
    renderTasks(filteredTasks);
  };

  const filterTasksByStatus = (statusFilter) => {
    const tasks = getAllTasks();
    const filteredTasks = tasks.filter((task) => {
      if (statusFilter === "completed") return task.completed; // Show only completed tasks
      if (statusFilter === "pending") return !task.completed; // Show only pending tasks
      return true;
    });
    renderTasks(filteredTasks);
  };

  searchInput.addEventListener("input", () => {
    const searchQuery = searchInput.value.toLowerCase();
    const tasks = getAllTasks();
    const filteredTasks = tasks.filter(task =>
      task.text.toLowerCase().includes(searchQuery)
    );
    renderTasks(filteredTasks);
  });

  document.getElementById("all-tasks-btn").addEventListener("click", () => {
    renderTasks(getAllTasks());
  });

  addTaskButton.addEventListener("click", addTask);
  viewTodayButton.addEventListener("click", () => filterTasksByDate("today"));
  viewAllButton.addEventListener("click", () => renderTasks(getAllTasks()));
  document.getElementById("completed-tasks-btn").addEventListener("click", () => {
    // Filter tasks and show only completed ones
    filterTasksByStatus("completed");
  });
  document.getElementById("pending-tasks-btn").addEventListener("click", () => {
    // Filter tasks and show only pending ones
    filterTasksByStatus("pending");
  });

  toggleSidebarButton.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
  });

  closeSidebarButton.addEventListener("click", () => {
    sidebar.classList.add("hidden");
  });

  loadTasks();
});
