/* ==========================================================================
   ReMarket - Product Details & Purchase Logic
   File: js/details.js
   Loads product details by ID, handles Buy Now, Contact Seller, and Favorites
   ========================================================================== */

let currentProduct = null;

document.addEventListener("DOMContentLoaded", function () {
  loadProductDetails();
});

// Load and display product details based on URL query parameter `?id=...`
function loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  const container = document.getElementById("detailsContainer");
  const notFoundContainer = document.getElementById("productNotFound");

  if (!productId) {
    showNotFound("No Product ID specified.");
    return;
  }

  // Retrieve products from localStorage
  const products = getStoredProducts();
  currentProduct = products.find(function (item) {
    return item.id === productId;
  });

  if (!currentProduct) {
    showNotFound("Product not found or might have been removed.");
    return;
  }

  // Hide error container, show details
  if (notFoundContainer) notFoundContainer.style.display = "none";
  if (container) container.style.display = "grid";

  // Render product details onto DOM
  renderProductInfo(currentProduct);
}

function showNotFound(message) {
  const container = document.getElementById("detailsContainer");
  const notFoundContainer = document.getElementById("productNotFound");
  const msgEl = document.getElementById("notFoundMessage");

  if (container) container.style.display = "none";
  if (notFoundContainer) notFoundContainer.style.display = "block";
  if (msgEl) msgEl.textContent = message;
}

// Populate UI elements with product details
function renderProductInfo(product) {
  // Title & ID
  document.title = `${product.name} | ReMarket`;
  document.getElementById("detailTitle").textContent = product.name;
  document.getElementById("detailId").textContent = product.id;

  // Price & Badges
  document.getElementById("detailPrice").textContent = formatPrice(product.price);
  
  const catBadge = document.getElementById("detailCategory");
  catBadge.textContent = product.category;

  const condBadge = document.getElementById("detailCondition");
  condBadge.textContent = product.condition;
  condBadge.className = `badge badge-condition ${product.condition.replace(/\s+/g, '-')}`;

  const statusBadge = document.getElementById("detailStatus");
  statusBadge.textContent = product.status;
  statusBadge.className = `badge ${product.status === 'Sold' ? 'badge-sold' : 'badge-available'}`;

  // Image
  const imgEl = document.getElementById("detailImage");
  const fallback = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80";
  imgEl.src = product.imageUrl || fallback;
  imgEl.alt = product.name;
  imgEl.onerror = function () {
    this.src = fallback;
  };

  // Location & Description
  document.getElementById("detailLocation").textContent = product.location;
  document.getElementById("detailDescription").textContent = product.description;

  // Seller Information
  document.getElementById("sellerName").textContent = product.sellerName;
  document.getElementById("sellerAvatar").textContent = product.sellerName.charAt(0).toUpperCase();
  document.getElementById("sellerEmail").textContent = product.sellerEmail;
  document.getElementById("sellerEmail").href = `mailto:${product.sellerEmail}?subject=Inquiry about ${encodeURIComponent(product.name)} on ReMarket`;
  document.getElementById("sellerPhone").textContent = product.sellerPhone;
  document.getElementById("sellerPhone").href = `tel:${product.sellerPhone}`;

  // Check Favorite status and update button
  updateFavoriteButtonState(product.id);

  // Check Sold status
  const buyBtn = document.getElementById("buyNowBtn");
  if (buyBtn) {
    if (product.status === "Sold") {
      buyBtn.disabled = true;
      buyBtn.innerHTML = "❌ Item Sold";
      buyBtn.className = "btn btn-secondary";
      buyBtn.style.cursor = "not-allowed";
    } else {
      buyBtn.disabled = false;
      buyBtn.innerHTML = "🛍️ Buy Now";
      buyBtn.className = "btn btn-primary";
    }
  }
}

// Update state of Favorite button on Details page
function updateFavoriteButtonState(productId) {
  const favBtn = document.getElementById("detailFavBtn");
  if (!favBtn) return;

  const favorites = getStoredFavorites();
  const isFav = favorites.includes(productId);

  if (isFav) {
    favBtn.innerHTML = "❤️ Remove from Favorites";
    favBtn.className = "btn btn-secondary active";
  } else {
    favBtn.innerHTML = "🤍 Add to Favorites";
    favBtn.className = "btn btn-secondary";
  }
}

// Handle Favorite button click on details page
function handleDetailFavoriteClick() {
  if (!currentProduct) return;
  toggleFavorite(currentProduct.id);
  updateFavoriteButtonState(currentProduct.id);
}

// Open "Buy Now" confirmation dialog
function openBuyModal() {
  if (!currentProduct || currentProduct.status === "Sold") {
    showToast("This product is already sold out.", "danger");
    return;
  }

  const modal = document.getElementById("buyConfirmModal");
  if (!modal) return;

  document.getElementById("modalProdName").textContent = currentProduct.name;
  document.getElementById("modalProdPrice").textContent = formatPrice(currentProduct.price);
  document.getElementById("modalProdSeller").textContent = currentProduct.sellerName;

  modal.classList.add("active");
}

function closeBuyModal() {
  const modal = document.getElementById("buyConfirmModal");
  if (modal) modal.classList.remove("active");
}

// Execute the purchase transaction
function confirmPurchase() {
  if (!currentProduct) return;

  const buyerNameInput = document.getElementById("buyerNameInput");
  const buyerName = buyerNameInput && buyerNameInput.value.trim() ? buyerNameInput.value.trim() : "Verified Student Buyer";

  // Step 1: Generate a unique Transaction ID (e.g. TXN-739102)
  const transactionId = "TXN-" + Math.floor(100000 + Math.random() * 900000);

  // Step 2: Timestamp the purchase
  const now = new Date();
  const purchaseDate = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }) + ", " + now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  // Step 3: Create the purchase record
  const newPurchase = {
    transactionId: transactionId,
    productId: currentProduct.id,
    productName: currentProduct.name,
    price: currentProduct.price,
    sellerName: currentProduct.sellerName,
    sellerEmail: currentProduct.sellerEmail,
    sellerPhone: currentProduct.sellerPhone,
    buyerName: buyerName,
    purchaseDate: purchaseDate,
    status: "Completed",
    imageUrl: currentProduct.imageUrl
  };

  // Step 4: Save to localStorage in `remarket_purchases`
  const purchases = getStoredPurchases();
  purchases.unshift(newPurchase);
  saveStoredPurchases(purchases);

  // Step 5: Mark the product as "Sold" in `remarket_products`
  const products = getStoredProducts();
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === currentProduct.id) {
      products[i].status = "Sold";
      currentProduct.status = "Sold";
      break;
    }
  }
  saveStoredProducts(products);

  // Close confirmation modal
  closeBuyModal();

  // Refresh details page view to reflect "Sold"
  renderProductInfo(currentProduct);

  // Step 6: Show Receipt Modal with Transaction details
  showReceiptModal(newPurchase);
}

// Show purchase receipt modal
function showReceiptModal(purchase) {
  const modal = document.getElementById("receiptModal");
  if (!modal) return;

  document.getElementById("receiptTxnId").textContent = purchase.transactionId;
  document.getElementById("receiptItem").textContent = purchase.productName;
  document.getElementById("receiptPrice").textContent = formatPrice(purchase.price);
  document.getElementById("receiptDate").textContent = purchase.purchaseDate;
  document.getElementById("receiptSeller").textContent = purchase.sellerName;
  document.getElementById("receiptBuyer").textContent = purchase.buyerName;

  modal.classList.add("active");
}

function closeReceiptModal() {
  const modal = document.getElementById("receiptModal");
  if (modal) modal.classList.remove("active");
}

// Open "Contact Seller" modal
function openContactModal() {
  if (!currentProduct) return;
  const modal = document.getElementById("contactModal");
  if (!modal) return;

  document.getElementById("contactSellerName").textContent = currentProduct.sellerName;
  document.getElementById("contactEmailLink").href = `mailto:${currentProduct.sellerEmail}?subject=Inquiry about ${encodeURIComponent(currentProduct.name)}&body=Hi ${currentProduct.sellerName}, I saw your listing for ${currentProduct.name} on ReMarket and I would like to buy it.`;
  document.getElementById("contactPhoneLink").href = `tel:${currentProduct.sellerPhone}`;
  document.getElementById("contactPhoneText").textContent = currentProduct.sellerPhone;

  modal.classList.add("active");
}

function closeContactModal() {
  const modal = document.getElementById("contactModal");
  if (modal) modal.classList.remove("active");
}
