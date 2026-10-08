/* ==========================================================================
   ReMarket - My Listings Logic
   File: js/listings.js
   Display user listings, toggle sold status, and delete products
   ========================================================================== */

let showOnlyMyUploads = true;

document.addEventListener("DOMContentLoaded", function () {
  displayListings();
});

// Toggle between showing user's uploaded items vs all items (very useful for viva demo)
function toggleListingView(onlyMine) {
  showOnlyMyUploads = onlyMine;
  const btnMine = document.getElementById("filterMineBtn");
  const btnAll = document.getElementById("filterAllBtn");

  if (btnMine && btnAll) {
    if (onlyMine) {
      btnMine.className = "btn btn-primary btn-sm";
      btnAll.className = "btn btn-secondary btn-sm";
    } else {
      btnMine.className = "btn btn-secondary btn-sm";
      btnAll.className = "btn btn-primary btn-sm";
    }
  }

  displayListings();
}

// Display listings table
function displayListings() {
  const tableBody = document.getElementById("listingsTableBody");
  const emptyState = document.getElementById("listingsEmptyState");
  const tableContainer = document.getElementById("listingsTableContainer");

  if (!tableBody) return;

  const allProducts = getStoredProducts();

  // Filter according to selected mode
  let listings = allProducts;
  if (showOnlyMyUploads) {
    listings = allProducts.filter(function (p) {
      return p.isUserListing === true;
    });
  }

  // Update Summary Stats
  updateListingStats(allProducts);

  // If no items match, display friendly empty state
  if (listings.length === 0) {
    if (tableContainer) tableContainer.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (tableContainer) tableContainer.style.display = "block";
  if (emptyState) emptyState.style.display = "none";

  // Clear previous rows
  tableBody.innerHTML = "";

  const fallback = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80";

  // Build rows using for-loop
  for (let i = 0; i < listings.length; i++) {
    const item = listings[i];
    const isSold = item.status === "Sold";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="table-product-info">
          <img 
            src="${item.imageUrl || fallback}" 
            alt="${escapeHtml(item.name)}" 
            class="table-product-thumb"
            onerror="this.src='${fallback}'"
          />
          <div>
            <div class="table-product-title">${escapeHtml(item.name)}</div>
            <div class="table-product-cat">${item.category} • ID: ${item.id}</div>
          </div>
        </div>
      </td>
      <td><strong>${formatPrice(item.price)}</strong></td>
      <td><span class="badge badge-condition ${item.condition.replace(/\s+/g, '-')}">${item.condition}</span></td>
      <td>
        <span class="badge ${isSold ? 'badge-sold' : 'badge-available'}">
          ● ${item.status}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button 
            class="btn btn-sm ${isSold ? 'btn-secondary' : 'btn-success'}"
            onclick="toggleProductStatus('${item.id}')"
            title="${isSold ? 'Mark as Available' : 'Mark as Sold'}"
          >
            ${isSold ? '↺ Mark Available' : '✓ Mark as Sold'}
          </button>
          <a href="details.html?id=${encodeURIComponent(item.id)}" class="btn btn-sm btn-outline" title="View details">
            👁 View
          </a>
          <button 
            class="btn btn-sm btn-danger" 
            onclick="deleteProduct('${item.id}')"
            title="Delete product"
          >
            🗑 Delete
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  }
}

// Update the statistics cards on top
function updateListingStats(products) {
  const userProducts = products.filter(function (p) {
    return p.isUserListing === true;
  });

  const targetList = showOnlyMyUploads ? userProducts : products;

  const totalEl = document.getElementById("statTotalListings");
  const activeEl = document.getElementById("statActiveListings");
  const soldEl = document.getElementById("statSoldListings");

  if (totalEl) totalEl.textContent = targetList.length;

  if (activeEl) {
    const activeCount = targetList.filter(function (p) {
      return p.status === "Available";
    }).length;
    activeEl.textContent = activeCount;
  }

  if (soldEl) {
    const soldCount = targetList.filter(function (p) {
      return p.status === "Sold";
    }).length;
    soldEl.textContent = soldCount;
  }
}

// Toggle status between "Available" and "Sold"
function toggleProductStatus(productId) {
  const products = getStoredProducts();

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      if (products[i].status === "Sold") {
        products[i].status = "Available";
        showToast("Product marked as Available", "success");
      } else {
        products[i].status = "Sold";
        showToast("Product marked as Sold", "default");
      }
      break;
    }
  }

  saveStoredProducts(products);
  displayListings();
  updateNavCounters();
}

// Delete product permanently from localStorage
function deleteProduct(productId) {
  const confirmDelete = confirm("Are you sure you want to delete this listing? This action cannot be undone.");
  if (!confirmDelete) return;

  let products = getStoredProducts();
  const initialLength = products.length;

  // Filter out the selected product
  products = products.filter(function (p) {
    return p.id !== productId;
  });

  if (products.length < initialLength) {
    saveStoredProducts(products);
    showToast("Product successfully deleted", "danger");
    displayListings();
    updateNavCounters();
  }
}

// Helper to escape HTML characters
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
