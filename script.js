/* ======================================
   BUGFLOW - ISSUE MANAGEMENT SYSTEM
====================================== */
"use strict";
const STORAGE_KEY = "bugflow_issues";
let bugs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
const titleInput = document.getElementById("bugTitle");
const descriptionInput = document.getElementById("bugDescription");
const priorityInput = document.getElementById("priority");
const categoryInput = document.getElementById("category");
const assigneeInput = document.getElementById("assignee");
const createButton = document.querySelector(".submit-btn");
const columns = document.querySelectorAll(".column");
const bugSearch = document.getElementById("bugSearch");
const priorityFilter = document.getElementById("priorityFilter");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");
const assigneeFilter = document.getElementById("assigneeFilter");
const dateFilter = document.getElementById("dateFilter");
const clearFilters = document.getElementById("clearFilters");
const filterCount = document.getElementById("filterCount");
createButton.addEventListener("click", createBug);
function createBug() {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    if (!title || !description) {
        alert("Please enter bug title and description");
        return;
    }
    const now = new Date();
    const bug = {
        id: Date.now(),
        title,
        description,
        priority: priorityInput.value,
        category: categoryInput.value,
        assignee: assigneeInput.value,
        status: "Backlog",
        created: now.toLocaleDateString(),
        createdISO: now.toISOString().split("T")[0]
    };
    bugs.push(bug);
    saveBugs();
    renderBugs();
    updateStats();
    clearForm();
}
function saveBugs() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bugs));
}
function renderBugs(data = bugs) {
    columns.forEach(column => {
        column.querySelectorAll(".bug-card").forEach(card => card.remove());
    });
    data.forEach(bug => {
        const card = document.createElement("div");
        card.className = "bug-card";
        card.innerHTML = `<span class="priority ${bug.priority.toLowerCase()}">${bug.priority}</span><h4>${bug.title}</h4><p>${bug.description}</p><small>${bug.category}</small><footer>#${bug.id}<br>👤 ${bug.assignee}<br>📅 ${bug.created || "N/A"}<br><button onclick="deleteBug(${bug.id})">Delete</button></footer>`;
        const column = getColumn(bug.status);
        if (column) column.appendChild(card);
    });
    if (filterCount) filterCount.innerText = `${data.length} bug${data.length !== 1 ? "s" : ""} found`;
}
function getColumn(status) {
    const headings = { Backlog: 0, Todo: 1, "In Progress": 2, Done: 3 };
    return columns[headings[status]];
}
function deleteBug(id) {
    bugs = bugs.filter(bug => bug.id !== id);
    saveBugs();
    applyFilters();
    updateStats();
}
function updateStats() {
    const cards = document.querySelectorAll(".stat-card h2");
    const total = bugs.length;
    const open = bugs.filter(b => b.status !== "Done").length;
    const progress = bugs.filter(b => b.status === "In Progress").length;
    const done = bugs.filter(b => b.status === "Done").length;
    if (cards.length >= 4) {
        cards[0].innerText = total;
        cards[1].innerText = open;
        cards[2].innerText = progress;
        cards[3].innerText = done;
    }
}
function clearForm() {
    titleInput.value = "";
    descriptionInput.value = "";
    priorityInput.value = "Critical";
    categoryInput.value = "Frontend";
    assigneeInput.value = "Dev Master";
}
function applyFilters() {
    const search = (bugSearch?.value || "").trim().toLowerCase();
    const priority = priorityFilter?.value || "All";
    const status = statusFilter?.value || "All";
    const category = categoryFilter?.value || "All";
    const assignee = assigneeFilter?.value || "All";
    const date = dateFilter?.value || "";
    const filtered = bugs.filter(bug => {
        const searchable = `${bug.id} ${bug.title} ${bug.description} ${bug.assignee}`.toLowerCase();
        const matchesSearch = !search || searchable.includes(search);
        const matchesPriority = priority === "All" || bug.priority === priority;
        const matchesStatus = status === "All" || bug.status === status;
        const matchesCategory = category === "All" || bug.category === category;
        const matchesAssignee = assignee === "All" || bug.assignee === assignee;
        const bugDate = bug.createdISO || convertStoredDate(bug.created);
        const matchesDate = !date || bugDate === date;
        return matchesSearch && matchesPriority && matchesStatus && matchesCategory && matchesAssignee && matchesDate;
    });
    renderBugs(filtered);
}
function convertStoredDate(value) {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
[bugSearch, priorityFilter, statusFilter, categoryFilter, assigneeFilter, dateFilter].forEach(element => {
    if (element) {
        element.addEventListener(element.tagName === "INPUT" ? "input" : "change", applyFilters);
    }
});
if (clearFilters) {
    clearFilters.addEventListener("click", () => {
        bugSearch.value = "";
        priorityFilter.value = "All";
        statusFilter.value = "All";
        categoryFilter.value = "All";
        assigneeFilter.value = "All";
        dateFilter.value = "";
        applyFilters();
    });
}
function loadDemo() {
    if (bugs.length) return;
    const today = new Date().toISOString().split("T")[0];
    bugs = [
        { id: 101, title: "Image loading issue", description: "Images are slow on homepage", priority: "Low", category: "Performance", assignee: "Dev Master", status: "Done", created: new Date().toLocaleDateString(), createdISO: today },
        { id: 102, title: "Checkout page crash", description: "Payment fails after submit", priority: "High", category: "Frontend", assignee: "Dev Master", status: "Backlog", created: new Date().toLocaleDateString(), createdISO: today },
        { id: 103, title: "Mobile navbar issue", description: "Menu overlaps content", priority: "Medium", category: "UI/UX", assignee: "Developer 2", status: "Todo", created: new Date().toLocaleDateString(), createdISO: today }
    ];
    saveBugs();
}
loadDemo();
renderBugs();
updateStats();