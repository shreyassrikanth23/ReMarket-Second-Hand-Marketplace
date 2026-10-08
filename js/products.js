/* ==========================================================================
   ReMarket - Marketplace Page Logic
   File: js/products.js
   Handles searching, category & condition filtering, sorting, and DOM rendering
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Check if category was passed from Home page via URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");
  const searchParam = urlParams.get("search");

  if (categoryParam) {
    const categorySelect = document.getElementById("categoryFilter");
    if (categorySelect) {
      categorySelect.value = categoryParam;
    }
  }

  if (searchParam) {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.value = searchParam;
    }
  }

  // 2. Attach Event Listeners to Search and Filters
  setupFilterEvents();

  // 3. Initial load & display of products
  applyAllFilters();
});

// Attach event listeners for real-time interaction
function setupFilterEvents() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const conditionFilter = document.getElementById("conditionFilter");
  const sortBy = document.getElementById("sortBy");
  const resetBtn = document.getElementById("resetFiltersBtn");

  if (searchInput) {
    searchInput.addEventListener("input", applyAllFilters);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyAllFilters);
  }
  if (conditionFilter) {
    conditionFilter.addEventListener("change", applyAllFilters);
  }
  if (sortBy) {
    sortBy.addEventListener("change", applyAllFilters);
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", resetFilters);
  }
}

// Master function that filters, searches, sorts, and displays products
function applyAllFilters() {
  // Step 1: Get all products from localStorage
  const allProducts = getStoredProducts();

  // Step 2: Read current filter input values
  const searchQuery = document.getElementById("searchInput") ? document.getElementById("searchInput").value.trim().toLowerCase() : "";
  const selectedCategory = document.getElementById("categoryFilter") ? document.getElementById("categoryFilter").value : "All";
  const selectedCondition = document.getElementById("conditionFilter") ? document.getElementById("conditionFilter").value : "All";
  const sortOption = document.getElementById("sortBy") ? document.getElementById("sortBy").value : "default";

  // Step 3: Filter array using Array.filter()
  let filtered = allProducts.filter(function (product) {
    // Search match (name, description, or location)
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.location.toLowerCase().includes(searchQuery);

    // Category match
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    // Condition match
    const matchesCondition =
      selectedCondition === "All" || product.condition === selectedCondition;

    return matchesSearch && matchesCategory && matchesCondition;
  });

  // Step 4: Sort products based on user choice
  if (sortOption === "price-low") {
    filtered.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (sortOption === "price-high") {
    filtered.sort(function (a, b) {
      return b.price - a.price;
    });
  } else if (sortOption === "newest") {
    filtered.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  // Step 5: Render results to the page
  displayProducts(filtered);

  // Step 6: Update product counter text
  updateResultCount(filtered.length, allProducts.length);
}

// Display products by generating HTML cards in the grid container
function displayProducts(productsList) {
  const container = document.getElementById("productsGrid");
  if (!container) return;

  // Clear previous contents
  container.innerHTML = "";

  // If no products match the criteria, show friendly empty state
  if (productsList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No Products Found</h3>
        <p>We couldn't find any products matching your search criteria. Try adjusting your filters or search keywords.</p>
        <button class="btn btn-primary" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  // Get current favorites list to set active heart state
  const favorites = getStoredFavorites();

  // Loop through products and create card elements
  for (let i = 0; i < productsList.length; i++) {
    const product = productsList[i];
    const isFav = favorites.includes(product.id);
    const isSold = product.status === "Sold";

    const card = document.createElement("div");
    card.className = "product-card";

    // Clean fallback image if image fails
    const fallbackImage = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80";

    card.innerHTML = `
      <div class="card-img-wrapper">
        <img 
          src="${product.imageUrl || fallbackImage}" 
          alt="${escapeHtml(product.name)}"
          loading="lazy"
          onerror="this.src='${fallbackImage}'"
        />
        <button 
          class="btn-favorite ${isFav ? 'active' : ''}" 
          data-fav-id="${product.id}"
          title="${isFav ? 'Remove from Favorites' : 'Add to Favorites'}"
          onclick="toggleFavorite('${product.id}', event)"
          aria-label="Add to favorites"
        >
          ${isFav ? '❤️' : '🤍'}
        </button>
        ${isSold ? '<span class="sold-overlay">SOLD</span>' : ''}
      </div>

      <div class="card-body">
        <div class="card-meta">
          <span class="badge badge-category">${product.category}</span>
          <span class="badge badge-condition ${product.condition.replace(/\s+/g, '-')}">${product.condition}</span>
        </div>

        <h3 class="card-title" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h3>
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

// Update the result counter element
function updateResultCount(displayedCount, totalCount) {
  const countElement = document.getElementById("resultCount");
  if (countElement) {
    countElement.textContent = `Showing ${displayedCount} of ${totalCount} items`;
  }
}

// Reset all filter fields to defaults
function resetFilters() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const conditionFilter = document.getElementById("conditionFilter");
  const sortBy = document.getElementById("sortBy");

  if (searchInput) searchInput.value = "";
  if (categoryFilter) categoryFilter.value = "All";
  if (conditionFilter) conditionFilter.value = "All";
  if (sortBy) sortBy.value = "default";

  // Re-run filter application
  applyAllFilters();
  showToast("Filters reset to default", "default");
}

// Basic security helper to escape HTML characters
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
