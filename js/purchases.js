/* ==========================================================================
   ReMarket - My Purchases Logic
   File: js/purchases.js
   Display purchase history, search by Transaction ID, and view receipt modal
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  displayPurchases();

  // Setup live search by Transaction ID or Product Name
  const searchInput = document.getElementById("searchTxnInput");
  if (searchInput) {
    searchInput.addEventListener("input", searchPurchases);
  }
});

// Display purchases with optional filtered list
function displayPurchases(customList) {
  const tableBody = document.getElementById("purchasesTableBody");
  const emptyState = document.getElementById("purchasesEmptyState");
  const tableContainer = document.getElementById("purchasesTableContainer");
  const countEl = document.getElementById("totalPurchasesCount");

  if (!tableBody) return;

  const purchases = customList !== undefined ? customList : getStoredPurchases();

  if (countEl) {
    countEl.textContent = purchases.length;
  }

  // If no purchases exist
  if (purchases.length === 0) {
    if (tableContainer) tableContainer.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (tableContainer) tableContainer.style.display = "block";
  if (emptyState) emptyState.style.display = "none";

  tableBody.innerHTML = "";

  const fallback = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80";

  for (let i = 0; i < purchases.length; i++) {
    const item = purchases[i];

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <span class="product-id-tag" style="font-weight: 700; color: var(--primary);">
          ${item.transactionId}
        </span>
      </td>
      <td>
        <div class="table-product-info">
          <img 
            src="${item.imageUrl || fallback}" 
            alt="${escapeHtml(item.productName)}" 
            class="table-product-thumb"
            onerror="this.src='${fallback}'"
          />
          <div>
            <div class="table-product-title">${escapeHtml(item.productName)}</div>
            <div class="table-product-cat">ID: ${item.productId}</div>
          </div>
        </div>
      </td>
      <td><strong>${formatPrice(item.price)}</strong></td>
      <td>
        <div><strong>${escapeHtml(item.sellerName)}</strong></div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">${item.sellerPhone || ''}</div>
      </td>
      <td><span style="font-size: 0.88rem; color: var(--text-muted);">${item.purchaseDate}</span></td>
      <td>
        <span class="badge badge-available">
          ✓ ${item.status || 'Completed'}
        </span>
      </td>
      <td>
        <button 
          class="btn btn-sm btn-outline" 
          onclick="viewReceipt('${item.transactionId}')"
          title="View Digital Receipt"
        >
          🧾 Receipt
        </button>
      </td>
    `;

    tableBody.appendChild(tr);
  }
}

// Search purchases by Transaction ID or Product Name
function searchPurchases() {
  const query = document.getElementById("searchTxnInput").value.trim().toLowerCase();
  const allPurchases = getStoredPurchases();

  if (!query) {
    displayPurchases(allPurchases);
    return;
  }

  const filtered = allPurchases.filter(function (item) {
    const txnMatch = item.transactionId.toLowerCase().includes(query);
    const nameMatch = item.productName.toLowerCase().includes(query);
    const sellerMatch = item.sellerName.toLowerCase().includes(query);
    return txnMatch || nameMatch || sellerMatch;
  });

  displayPurchases(filtered);
}

// View digital receipt modal
function viewReceipt(transactionId) {
  const purchases = getStoredPurchases();
  const record = purchases.find(function (p) {
    return p.transactionId === transactionId;
  });

  if (!record) {
    showToast("Receipt record not found", "danger");
    return;
  }

  const modal = document.getElementById("receiptModal");
  if (!modal) return;

  document.getElementById("modalTxnId").textContent = record.transactionId;
  document.getElementById("modalTxnItem").textContent = record.productName;
  document.getElementById("modalTxnPrice").textContent = formatPrice(record.price);
  document.getElementById("modalTxnDate").textContent = record.purchaseDate;
  document.getElementById("modalTxnSeller").textContent = record.sellerName;
  document.getElementById("modalTxnBuyer").textContent = record.buyerName || "Verified Buyer";
  document.getElementById("modalTxnContact").textContent = `${record.sellerEmail} | ${record.sellerPhone}`;

  modal.classList.add("active");
}

function closeReceiptModal() {
  const modal = document.getElementById("receiptModal");
  if (modal) modal.classList.remove("active");
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
