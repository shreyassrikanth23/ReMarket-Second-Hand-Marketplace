/* ==========================================================================
   ReMarket - Favorites Page Logic
   File: js/favorites.js
   Display user saved items and manage removal
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  displayFavorites();
});

function displayFavorites() {
  const container = document.getElementById("favoritesGrid");
  const emptyState = document.getElementById("favoritesEmptyState");
  const countEl = document.getElementById("favoritesCountText");

  if (!container) return;

  const favoriteIds = getStoredFavorites();
  const allProducts = getStoredProducts();

  // Find products that match favorite IDs
  const favoriteProducts = allProducts.filter(function (prod) {
    return favoriteIds.includes(prod.id);
  });

  if (countEl) {
    countEl.textContent = `You have saved ${favoriteProducts.length} item(s)`;
  }

  // If empty
  if (favoriteProducts.length === 0) {
    container.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  container.style.display = "grid";
  if (emptyState) emptyState.style.display = "none";
  container.innerHTML = "";

  const fallback = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80";

  for (let i = 0; i < favoriteProducts.length; i++) {
    const product = favoriteProducts[i];
    const isSold = product.status === "Sold";

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="card-img-wrapper">
        <img 
          src="${product.imageUrl || fallback}" 
          alt="${escapeHtml(product.name)}"
          onerror="this.src='${fallback}'"
        />
        <button 
          class="btn-favorite active" 
          title="Remove from Favorites"
          onclick="toggleFavorite('${product.id}', event)"
        >
          ❤️
        </button>
        ${isSold ? '<span class="sold-overlay">SOLD</span>' : ''}
      </div>

      <div class="card-body">
        <div class="card-meta">
          <span class="badge badge-category">${product.category}</span>
          <span class="badge badge-condition ${product.condition.replace(/\s+/g, '-')}">${product.condition}</span>
        </div>

        <h3 class="card-title">${escapeHtml(product.name)}</h3>
        <div class="card-price">${formatPrice(product.price)}</div>

        <div class="card-location">
          <span>📍</span>
          <span>${escapeHtml(product.location)}</span>
        </div>

        <div class="card-footer">
          <span class="badge ${isSold ? 'badge-sold' : 'badge-available'}">
            ● ${product.status}
          </span>
          <a href="details.html?id=${encodeURIComponent(product.id)}" class="btn btn-outline btn-sm">
            View Details
          </a>
        </div>
      </div>
    `;

    container.appendChild(card);
  }
}

// Basic security helper
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
