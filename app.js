function average(projects) {
  if (!projects.length) return 0;
  const total = projects.reduce((sum, project) => sum + Number(project.percent || 0), 0);
  return Math.round(total / projects.length);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cardHtml(project) {
  const percent = Math.max(0, Math.min(100, Number(project.percent) || 0));
  const color = project.color || "#2bb3a8";
  const blocker = project.blocker
    ? `<p class="blocker"><strong>Blocker:</strong> ${escapeHtml(project.blocker)}</p>`
    : "";
  const link = project.url
    ? `<a class="site" href="${escapeHtml(project.url)}" rel="noopener noreferrer">${escapeHtml(project.url.replace(/^https:\/\//, ""))}</a>`
    : `<p class="meta">No live site yet.</p>`;

  return `
    <article class="card" style="--accent: ${escapeHtml(color)}">
      <div class="card-head">
        <h2>${escapeHtml(project.name)}</h2>
        <p class="pct" style="color: var(--accent)">${percent}%</p>
      </div>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" aria-label="${escapeHtml(project.name)} completion">
        <span style="width: ${percent}%; background: var(--accent)"></span>
      </div>
      <p class="estimate">Estimate: ${escapeHtml(project.estimate)}</p>
      <p class="status">${escapeHtml(project.status)}</p>
      <p class="meta"><strong>Last updated:</strong> ${escapeHtml(project.lastUpdatedLabel || project.lastUpdated)}</p>
      <p class="next"><strong>Next step:</strong> ${escapeHtml(project.nextStep)}</p>
      ${blocker}
      ${link}
    </article>
  `;
}

async function load() {
  const errorEl = document.getElementById("error");
  try {
    const response = await fetch("/data/projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load project data.");
    const data = await response.json();
    const projects = Array.isArray(data.projects) ? data.projects : [];
    const avg = average(projects);

    document.getElementById("average").textContent = `${avg}%`;
    document.getElementById("count").textContent = String(projects.length);
    document.getElementById("count-label").textContent = projects.length === 1 ? "Project" : "Projects";
    document.getElementById("asof").textContent = data.asOfLabel ? `As of ${data.asOfLabel}` : "";
    document.getElementById("cards").innerHTML = projects.map(cardHtml).join("");
  } catch (err) {
    errorEl.hidden = false;
    errorEl.textContent = "The project list could not be loaded. Try refreshing, or reopen the app when you have a connection.";
    console.error(err);
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("Service worker registration failed", err);
    });
  });
}

load();
