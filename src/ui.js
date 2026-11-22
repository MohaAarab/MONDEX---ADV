// Presentation layer only. Keep all button class hooks and data-id attributes
// used by the existing main.js event delegation.
function createEl(tag, className = "", text = "") {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

const loading = document.querySelector("#loading");
export function showStatus(message) { loading.textContent = message; }
export function clearGrid() {
  document.querySelector("#grid").replaceChildren();
  document.querySelector("#creature-count").textContent = "0";
}
export function hideDetail() {
  document.querySelector("#detail").classList.add("hidden");
  document.querySelector("#detail-placeholder")?.classList.remove("hidden");
}

export function affich(list, total, teamCount) {
  const container = document.querySelector("#grid");
  const fragment = document.createDocumentFragment();
  for (const creature of list) {
    const card = createEl("article", "vault-card");
    card.dataset.id = creature.id;
    const frame = createEl("div", "vault-card-frame");
    const img = createEl("img", "vault-card-image");
    img.src = creature.image;
    img.alt = creature.name;
    img.loading = "lazy";
    frame.append(img);
    const catalog = createEl("span", "vault-card-id", `MDX-${String(creature.id).padStart(3, "0")}`);
    const name = createEl("h3", "vault-card-name", creature.name);
    const type = createEl("p", "vault-card-type", creature.type);
    const actions = createEl("div", "vault-card-actions");
    const favoriteBtn = createEl("button", "btn-favorite vault-card-action", "♡ Favoris");
    favoriteBtn.type = "button";
    favoriteBtn.dataset.id = creature.id;
    const addBtn = createEl("button", "btn-add vault-card-action", "+ Équipe");
    addBtn.type = "button";
    addBtn.dataset.id = creature.id;
    actions.append(favoriteBtn, addBtn);
    card.append(frame, catalog, name, type);
    // if (level) card.append(level);
    card.append(actions);
    fragment.append(card);
  }
  container.replaceChildren(fragment);
  document.querySelector("#creature-count").textContent = total;
  updateButtons(teamCount);
}

export function detail(creature, teamCount) {
  const max = 5000;
  const attack = Number(creature.stats?.attack ?? 0);
  const defense = Number(creature.stats?.defense ?? creature.stats?.defence ?? 0);
  const detailPanel = document.querySelector("#detail");
  document.querySelector("#detail-placeholder")?.classList.add("hidden");
  detailPanel.classList.remove("hidden");
  const section = createEl("section", "vault-inspection-card");
  section.setAttribute("aria-label", "Détail de la créature");
  const header = createEl("div", "vault-detail-header");
  const heading = createEl("div", "vault-detail-heading");
  heading.append(createEl("span", "vault-kicker", "CARD INSPECTION"), createEl("h2", "", creature.name));
  const closeBtn = createEl("button", "btn-close vault-close", "✕");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Fermer le détail");
  header.append(heading, closeBtn);
  const frame = createEl("div", "vault-detail-image-frame");
  const img = createEl("img", "vault-detail-image");
  img.src = creature.image;
  img.alt = creature.name;
  frame.append(img);
  const info = createEl("div", "vault-detail-content");
  info.append(
    createEl("p", "vault-detail-catalog", `CATALOGUE NO. ${String(creature.id).padStart(3, "0")}`),
    createEl("h3", "vault-detail-section-title", "Description & Attributes"),
    createEl("p", "vault-description", creature.description ?? ""),
    createEl("p", "vault-detail-type", `TYPE · ${creature.type}`)
  );
  const stats = createEl("div", "vault-stats");
  function createStat(label, value) {
    const row = createEl("div", "vault-stat");
    const labelEl = createEl("span", "vault-stat-label", label);
    const number = createEl("strong", "vault-stat-value", String(value));
    const bar = createEl("span", "vault-stat-track");
    const fill = createEl("span", "vault-stat-fill");
    fill.style.width = `${Math.min(100, Math.max(0, value / max * 100))}%`;
    bar.append(fill);
    row.append(labelEl, number, bar);
    return row;
  }
  stats.append(createStat("ATK", attack), createStat("DEF", defense));
  const actionsTitle = createEl("h3", "vault-detail-section-title", "Vault Management");
  const actions = createEl("div", "vault-detail-actions");
  const addBtn = createEl("button", "btn-add vault-detail-button", "Add to Team");
  const editBtn = createEl("button", "btn-edit vault-detail-button", "Modifier");
  const deleteBtn = createEl("button", "btn-delete vault-detail-button vault-delete", "Supprimer");
  for (const button of [addBtn, editBtn, deleteBtn]) {
    button.type = "button";
    button.dataset.id = creature.id;
  }
  actions.append(addBtn, editBtn, deleteBtn);
  info.append(stats, actionsTitle, actions);
  section.append(header, frame, info);
  detailPanel.replaceChildren(section);
  updateButtons(teamCount);
}

export function updateButtons(teamCount) {
  document.querySelectorAll(".btn-add").forEach(button => {
    button.disabled = teamCount >= 6;
    button.classList.toggle("vault-disabled", teamCount >= 6);
  });
}

const MAX_TEAM = 6;
const teamSlots = document.querySelector("#team-slots");
const teamMsg = document.querySelector("#team-msg");
const teamCount = document.querySelector("#team-count");
const teamCounter = document.querySelector("#team-counter");

export function teamCreation(team, findCreature) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < MAX_TEAM; i++) {
    if (i < team.length) {
      const creature = findCreature(team[i]);
      if (!creature) {
        fragment.append(createEl("div", "vault-team-slot vault-team-slot-empty", "+"));
        continue;
      }
      const slot = createEl("div", "vault-team-slot vault-team-slot-filled");
      const img = createEl("img", "vault-team-image");
      img.src = creature.image;
      img.alt = creature.name;
      const label = createEl("span", "vault-team-name", creature.name);
      const remove = createEl("button", "btn-remove vault-remove", "Retirer");
      remove.type = "button";
      remove.dataset.id = creature.id;
      slot.append(img, label, remove);
      fragment.append(slot);
    } else {
      fragment.append(createEl("div", "vault-team-slot vault-team-slot-empty", "+"));
    }
  }
  teamSlots.replaceChildren(fragment);
  if (teamCount) teamCount.textContent = team.length;
  teamCounter.textContent = `${team.length}/${MAX_TEAM}`;
  teamMsg.textContent = team.length === 0 ? "Aucune carte dans l'équipe" : "";
  updateButtons(team.length);
}

const retryBtn = document.querySelector("#retry-btn");
export function showRetry() { retryBtn.classList.remove("hidden"); }
export function hideRetry() { retryBtn.classList.add("hidden"); }
