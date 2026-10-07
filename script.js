const internships = [
  {
    title: "Frontend Developer Intern",
    company: "Nova Labs",
    domain: "Web Development",
    mode: "Remote",
    duration: "3 months",
    location: "India",
    description: "Build responsive interfaces using HTML, CSS and JavaScript.",
    url: "https://github.com/"
  },
  {
    title: "Python Developer Intern",
    company: "CodeNest",
    domain: "Python",
    mode: "Hybrid",
    duration: "2 months",
    location: "Chennai",
    description: "Work on Python automation, APIs and data processing.",
    url: "https://github.com/"
  },
  {
    title: "UI/UX Design Intern",
    company: "PixelCraft",
    domain: "Design",
    mode: "Remote",
    duration: "3 months",
    location: "India",
    description: "Create user flows, wireframes and product interfaces.",
    url: "https://github.com/"
  },
  {
    title: "Data Analyst Intern",
    company: "InsightWorks",
    domain: "Data Science",
    mode: "On-site",
    duration: "4 months",
    location: "Bengaluru",
    description: "Explore datasets and create reports and dashboards.",
    url: "https://github.com/"
  },
  {
    title: "AI/ML Intern",
    company: "FutureMind",
    domain: "Artificial Intelligence",
    mode: "Hybrid",
    duration: "3 months",
    location: "Chennai",
    description: "Assist with machine-learning experiments and evaluation.",
    url: "https://github.com/"
  },
  {
    title: "Node.js Backend Intern",
    company: "CloudBridge",
    domain: "Backend Development",
    mode: "Remote",
    duration: "3 months",
    location: "India",
    description: "Develop REST APIs and backend services using Node.js.",
    url: "https://github.com/"
  }
];

const searchInput = document.getElementById("searchInput");
const domainFilter = document.getElementById("domainFilter");
const clearButton = document.getElementById("clearButton");
const emptyClearButton = document.getElementById("emptyClearButton");
const retryButton = document.getElementById("retryButton");
const cardGrid = document.getElementById("cardGrid");
const emptyState = document.getElementById("emptyState");
const errorState = document.getElementById("errorState");
const resultCount = document.getElementById("resultCount");

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (char) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[char];
  });
}

function loadDomains() {
  const domains = [...new Set(internships.map(item => item.domain))];

  domains.forEach(domain => {
    const option = document.createElement("option");
    option.value = domain;
    option.textContent = domain;
    domainFilter.appendChild(option);
  });
}

function getFilteredInternships() {
  const search = searchInput.value.trim().toLowerCase();
  const domain = domainFilter.value;

  return internships.filter(item => {
    const text = [
      item.title,
      item.company,
      item.domain,
      item.location,
      item.description
    ].join(" ").toLowerCase();

    const searchMatch = !search || text.includes(search);
    const domainMatch = domain === "all" || item.domain === domain;

    return searchMatch && domainMatch;
  });
}

function displayInternships(items) {
  cardGrid.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("article");

    card.className = "internship-card";
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="card-top">
        <div>
          <h3>${escapeHTML(item.title)}</h3>
          <p class="company">${escapeHTML(item.company)}</p>
        </div>

        <span class="tag">
          ${escapeHTML(item.domain)}
        </span>
      </div>

      <div class="meta">
        <span>${escapeHTML(item.mode)}</span>
        <span>${escapeHTML(item.duration)}</span>
        <span>${escapeHTML(item.location)}</span>
      </div>

      <p>${escapeHTML(item.description)}</p>

      <a
        class="apply-link"
        href="${escapeHTML(item.url)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        View opportunity →
      </a>
    `;

    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        card.querySelector(".apply-link").click();
      }
    });

    cardGrid.appendChild(card);
  });
}

function updateBoard() {
  try {
    const results = getFilteredInternships();

    resultCount.textContent = results.length;

    displayInternships(results);

    if (results.length === 0) {
      emptyState.hidden = false;
      cardGrid.hidden = true;
    } else {
      emptyState.hidden = true;
      cardGrid.hidden = false;
    }

    errorState.hidden = true;
  } catch (error) {
    console.error(error);

    cardGrid.hidden = true;
    emptyState.hidden = true;
    errorState.hidden = false;
  }
}

function clearFilters() {
  searchInput.value = "";
  domainFilter.value = "all";
  updateBoard();
  searchInput.focus();
}

searchInput.addEventListener("input", updateBoard);
domainFilter.addEventListener("change", updateBoard);

clearButton.addEventListener("click", clearFilters);
emptyClearButton.addEventListener("click", clearFilters);

retryButton.addEventListener("click", updateBoard);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    clearFilters();
  }
});

loadDomains();
updateBoard();
