const API_URL = "http://localhost:3000";

const searchInput = document.getElementById("searchInput");
const domainFilter = document.getElementById("domainFilter");
const clearButton = document.getElementById("clearButton");
const retryButton = document.getElementById("retryButton");
const emptyClearButton = document.getElementById("emptyClearButton");

const cardGrid = document.getElementById("cardGrid");
const errorState = document.getElementById("errorState");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");

let internships = [];

// Load internship data from API
async function loadInternships() {
  showLoading();

  try {
    const response = await fetch(`${API_URL}/internships`);

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const result = await response.json();

    internships = result.data || result;

    createDomainOptions();
    renderInternships();
  } catch (error) {
    showError();
  }
}

// Loading state
function showLoading() {
  errorState.hidden = true;
  emptyState.hidden = true;
  cardGrid.innerHTML = "<p>Loading internships...</p>";
}

// Error state
function showError() {
  errorState.hidden = false;
  emptyState.hidden = true;
  cardGrid.innerHTML = "";
  resultCount.textContent = "0";
}

// Create domain filter options
function createDomainOptions() {
  const domains = [...new Set(internships.map(item => item.domain))];

  domainFilter.innerHTML = '<option value="all">All domains</option>';

  domains.forEach(domain => {
    const option = document.createElement("option");
    option.value = domain;
    option.textContent = domain;
    domainFilter.appendChild(option);
  });
}

// Render internships
function renderInternships() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedDomain = domainFilter.value;

  const filtered = internships.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchText) ||
      item.company.toLowerCase().includes(searchText) ||
      item.domain.toLowerCase().includes(searchText);

    const matchesDomain =
      selectedDomain === "all" ||
      item.domain === selectedDomain;

    return matchesSearch && matchesDomain;
  });

  cardGrid.innerHTML = "";
  resultCount.textContent = filtered.length;

  if (filtered.length === 0) {
    emptyState.hidden = false;
    errorState.hidden = true;
    return;
  }

  emptyState.hidden = true;
  errorState.hidden = true;

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <h3>${escapeHTML(item.title)}</h3>
      <p><strong>Company:</strong> ${escapeHTML(item.company)}</p>
      <p><strong>Domain:</strong> ${escapeHTML(item.domain)}</p>
      <button type="button" class="apply-button" data-id="${item.id}">
        Apply Now
      </button>
    `;

    cardGrid.appendChild(card);
  });

  document.querySelectorAll(".apply-button").forEach(button => {
    button.addEventListener("click", () => {
      showApplicationForm(button.dataset.id);
    });
  });
}

// Application form
function showApplicationForm(internshipId) {
  const existing = document.getElementById("applicationForm");

  if (existing) {
    existing.remove();
  }

  const form = document.createElement("form");
  form.id = "applicationForm";
  form.innerHTML = `
    <h2>Apply for Internship</h2>

    <label for="appName">Name</label>
    <input id="appName" name="name" type="text" required>

    <label for="appEmail">Email</label>
    <input id="appEmail" name="email" type="email" required>

    <input
      id="appInternshipId"
      name="internship_id"
      type="hidden"
      value="${internshipId}"
    >

    <button type="submit">Submit Application</button>

    <p id="applicationMessage"></p>
  `;

  document.querySelector("main").prepend(form);

  form.addEventListener("submit", submitApplication);

  form.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// Submit application to API
async function submitApplication(event) {
  event.preventDefault();

  const form = event.target;
  const message = document.getElementById("applicationMessage");

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const internship_id = form.internship_id.value;

  if (!name || !email || !internship_id) {
    message.textContent = "Please fill all required fields.";
    return;
  }

  if (!email.includes("@")) {
    message.textContent = "Please enter a valid email.";
    return;
  }

  message.textContent = "Submitting...";

  try {
    const response = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        internship_id: Number(internship_id),
        name,
        email
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Application failed");
    }

    message.textContent =
      "Application submitted successfully!";
    
    form.reset();

  } catch (error) {
    message.textContent = error.message;
  }
}

// Prevent HTML injection
function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Clear filters
function clearFilters() {
  searchInput.value = "";
  domainFilter.value = "all";
  renderInternships();
}

// Events
searchInput.addEventListener("input", renderInternships);
domainFilter.addEventListener("change", renderInternships);
clearButton.addEventListener("click", clearFilters);
retryButton.addEventListener("click", loadInternships);
emptyClearButton.addEventListener("click", clearFilters);

// Start
loadInternships();
