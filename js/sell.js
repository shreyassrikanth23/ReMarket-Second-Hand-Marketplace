/* ==========================================================================
   ReMarket - Sell Product Logic & Validation
   File: js/sell.js
   Form validation, image preview, product ID generation, and localStorage save
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const sellForm = document.getElementById("sellProductForm");
  const imageUrlInput = document.getElementById("productImage");
  const imagePreview = document.getElementById("imagePreview");

  // 1. Live Image URL preview
  if (imageUrlInput && imagePreview) {
    imageUrlInput.addEventListener("input", function () {
      updateImagePreview(imageUrlInput.value.trim());
    });
  }

  // 2. Form submission event
  if (sellForm) {
    sellForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent standard page reload

      if (validateForm()) {
        addProduct();
      }
    });
  }
});

// Update the visual image preview box
function updateImagePreview(url) {
  const previewBox = document.getElementById("imagePreview");
  if (!previewBox) return;

  if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:"))) {
    previewBox.innerHTML = `
      <img src="${url}" alt="Preview" onerror="handlePreviewError()" />
    `;
  } else {
    previewBox.innerHTML = `<span>Enter a valid image URL to preview</span>`;
  }
}

function handlePreviewError() {
  const previewBox = document.getElementById("imagePreview");
  if (previewBox) {
    previewBox.innerHTML = `<span style="color: var(--danger)">Unable to load image from URL. Please check link.</span>`;
  }
}

// Preset quick sample image filler (Extremely helpful for quick live demo during hackathons)
function setSampleImage(url) {
  const imageUrlInput = document.getElementById("productImage");
  if (imageUrlInput) {
    imageUrlInput.value = url;
    updateImagePreview(url);
    clearFieldError("productImage");
  }
}

// Validate all form fields according to hackathon requirements
function validateForm() {
  let isValid = true;

  // Retrieve input elements
  const nameInput = document.getElementById("productName");
  const categoryInput = document.getElementById("productCategory");
  const priceInput = document.getElementById("productPrice");
  const conditionInput = document.getElementById("productCondition");
  const descInput = document.getElementById("productDescription");
  const locInput = document.getElementById("productLocation");
  const sellerNameInput = document.getElementById("sellerName");
  const sellerEmailInput = document.getElementById("sellerEmail");
  const sellerPhoneInput = document.getElementById("sellerPhone");
  const imageInput = document.getElementById("productImage");

  // 1. Validate Product Name (Required, at least 3 chars)
  if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
    showFieldError("productName", "Product name must be at least 3 characters.");
    isValid = false;
  } else {
    clearFieldError("productName");
  }

  // 2. Validate Category (Must not be empty)
  if (!categoryInput.value) {
    showFieldError("productCategory", "Please select a category.");
    isValid = false;
  } else {
    clearFieldError("productCategory");
  }

  // 3. Validate Price (Must be positive number)
  const priceValue = parseFloat(priceInput.value);
  if (isNaN(priceValue) || priceValue <= 0) {
    showFieldError("productPrice", "Please enter a valid positive price greater than ₹0.");
    isValid = false;
  } else {
    clearFieldError("productPrice");
  }

  // 4. Validate Condition (Must be selected)
  if (!conditionInput.value) {
    showFieldError("productCondition", "Please select the condition of your item.");
    isValid = false;
  } else {
    clearFieldError("productCondition");
  }

  // 5. Validate Description (At least 10 chars)
  if (!descInput.value.trim() || descInput.value.trim().length < 10) {
    showFieldError("productDescription", "Description must be at least 10 characters long.");
    isValid = false;
  } else {
    clearFieldError("productDescription");
  }

  // 6. Validate Location (Required)
  if (!locInput.value.trim()) {
    showFieldError("productLocation", "Please enter your campus/city location.");
    isValid = false;
  } else {
    clearFieldError("productLocation");
  }

  // 7. Validate Seller Name (Required)
  if (!sellerNameInput.value.trim()) {
    showFieldError("sellerName", "Please enter your name.");
    isValid = false;
  } else {
    clearFieldError("sellerName");
  }

  // 8. Validate Seller Email (Standard email regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sellerEmailInput.value.trim())) {
    showFieldError("sellerEmail", "Please enter a valid email address (e.g. name@example.com).");
    isValid = false;
  } else {
    clearFieldError("sellerEmail");
  }

  // 9. Validate Phone Number (10 digits)
  const phoneValue = sellerPhoneInput.value.trim().replace(/\D/g, ""); // remove spaces/dashes
  if (phoneValue.length !== 10) {
    showFieldError("sellerPhone", "Please enter a valid 10-digit phone number.");
    isValid = false;
  } else {
    clearFieldError("sellerPhone");
  }

  // 10. Validate Product Image (If empty, set default placeholder)
  if (!imageInput.value.trim()) {
    showFieldError("productImage", "Please provide an image URL or click a sample below.");
    isValid = false;
  } else {
    clearFieldError("productImage");
  }

  return isValid;
}

// Helper to show red border & error message
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.add("error");
  const errorEl = document.getElementById(fieldId + "Error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
}

// Helper to remove red border & error message
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.remove("error");
  const errorEl = document.getElementById(fieldId + "Error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.style.display = "none";
  }
}

// Create new product object and save into localStorage
function addProduct() {
  // Step 1: Generate unique Product ID
  // Format: PROD-XXXX where XXXX is random number
  const uniqueId = "PROD-" + Math.floor(1000 + Math.random() * 9000);

  // Step 2: Extract sanitized values from inputs
  const newProduct = {
    id: uniqueId,
    name: document.getElementById("productName").value.trim(),
    category: document.getElementById("productCategory").value,
    price: parseFloat(document.getElementById("productPrice").value),
    condition: document.getElementById("productCondition").value,
    description: document.getElementById("productDescription").value.trim(),
    location: document.getElementById("productLocation").value.trim(),
    sellerName: document.getElementById("sellerName").value.trim(),
    sellerEmail: document.getElementById("sellerEmail").value.trim(),
    sellerPhone: document.getElementById("sellerPhone").value.trim().replace(/\D/g, ""),
    imageUrl: document.getElementById("productImage").value.trim(),
    status: "Available",
    isUserListing: true, // Marked as listed by the current user
    createdAt: new Date().toISOString().split("T")[0] // YYYY-MM-DD
  };

  // Step 3: Retrieve existing products from localStorage
  const products = getStoredProducts();

  // Step 4: Add new product to the FRONT of the array so it shows first
  products.unshift(newProduct);

  // Step 5: Save updated array back into localStorage
  saveStoredProducts(products);

  // Step 6: Update navbar counters
  updateNavCounters();

  // Step 7: Display success modal/message
  showSuccessModal(newProduct);
}

// Display completion modal with navigation shortcuts
function showSuccessModal(product) {
  const modal = document.getElementById("successModal");
  const modalInfo = document.getElementById("modalSuccessInfo");

  if (modal && modalInfo) {
    modalInfo.innerHTML = `
      <p>Your listing <strong>"${escapeHtml(product.name)}"</strong> has been successfully published!</p>
      <div class="receipt-box" style="margin: 15px 0;">
        <div class="receipt-row"><span>Product ID:</span> <strong>${product.id}</strong></div>
        <div class="receipt-row"><span>Listed Price:</span> <strong>${formatPrice(product.price)}</strong></div>
        <div class="receipt-row"><span>Category:</span> <strong>${product.category}</strong></div>
        <div class="receipt-row"><span>Condition:</span> <strong>${product.condition}</strong></div>
      </div>
      <p style="font-size: 0.9rem; color: var(--text-muted);">
        It is now live in the Marketplace and saved in your "My Listings" tab.
      </p>
    `;

    modal.classList.add("active");
  } else {
    alert("Listing published successfully! Product ID: " + product.id);
    window.location.href = "products.html";
  }
}
