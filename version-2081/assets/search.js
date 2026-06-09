import { SEARCH_ITEMS } from "./search-index.js";

const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");
const params = new URLSearchParams(window.location.search);
const initialKeyword = params.get("q") || "";

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function makeCard(item) {
  const tags = [item.year, item.region, item.type].filter(Boolean).join(" · ");
  const text = item.oneLine || item.genre || "";
  return `
<article class="movie-card">
  <a href="${item.url}" class="poster-link">
    <span class="poster-frame">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <span class="poster-badge">${item.type}</span>
    </span>
  </a>
  <div class="card-body">
    <a class="card-title" href="${item.url}">${item.title}</a>
    <div class="card-meta">${tags}</div>
    <div class="card-genre">${item.genre}</div>
    <p>${text}</p>
  </div>
</article>`;
}

function render(keyword) {
  const q = normalize(keyword);
  const source = q
    ? SEARCH_ITEMS.filter((item) => {
        const haystack = [item.title, item.year, item.region, item.type, item.genre, item.oneLine, (item.tags || []).join(" ")].join(" ").toLowerCase();
        return haystack.includes(q);
      })
    : SEARCH_ITEMS.slice(0, 60);

  results.innerHTML = source.slice(0, 120).map(makeCard).join("");
}

if (input) {
  input.value = initialKeyword;
  input.addEventListener("input", () => render(input.value));
}

render(initialKeyword);
