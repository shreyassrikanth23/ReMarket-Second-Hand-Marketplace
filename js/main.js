/* ==========================================================================
   ReMarket - Main Common Script
   File: js/main.js
   Handles Navbar active state, mobile menu, toast alerts, & favorite toggle
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  highlightActiveNavLink();
  setupMobileNav();
  updateNavCounters();
});

// 1. Highlight the current active page in the navigation bar
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href) return;

    // Check if the link href matches the ending of the current URL
    if (currentPath.endsWith(href) || (currentPath.endsWith("/") && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// 2. Setup mobile hamburger menu toggle
function setupMobileNav() {
  const toggleBtn = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      const isExpanded = navLinks.classList.contains("active");
      toggleBtn.setAttribute("aria-expanded", isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      if (!toggleBtn.contains(event.target) && !navLinks.contains(event.target)) {
        navLinks.classList.remove("active");
      }
    });
  }
}

// 3. Update notification counters in navbar (Favorites & My Listings counts)
function updateNavCounters() {
  // Update Favorites badge
  const favBadge = document.getElementById("favCountBadge");
  if (favBadge) {
    const favorites = getStoredFavorites();
    favBadge.textContent = favorites.length;
    favBadge.style.display = favorites.length > 0 ? "inline-block" : "none";
  }

  // Update My Listings badge
  const listingsBadge = document.getElementById("listingsCountBadge");
  if (listingsBadge) {
    const products = getStoredProducts();
    const userListings = products.filter(function (p) {
      return p.isUserListing === true;
    });
    if (userListings.length > 0) {
      listingsBadge.textContent = userListings.length;
      listingsBadge.style.display = "inline-block";
    } else {
      listingsBadge.style.display = "none";
    }
  }
}

// 4. Toggle Favorite product in localStorage
function toggleFavorite(productId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  let favorites = getStoredFavorites();
  const index = favorites.indexOf(productId);

  if (index === -1) {
    favorites.push(productId);
    showToast("Added to your Favorites ❤️", "success");
  } else {
    favorites.splice(index, 1);
    showToast("Removed from Favorites", "default");
  }

  saveStoredFavorites(favorites);
  updateNavCounters();

  // If there are favorite buttons on the page with data-id, toggle their style
  const buttons = document.querySelectorAll(`[data-fav-id="${productId}"]`);
  buttons.forEach(function (btn) {
    if (favorites.includes(productId)) {
      btn.classList.add("active");
      btn.innerHTML = "❤️";
      btn.title = "Remove from Favorites";
    } else {
      btn.classList.remove("active");
      btn.innerHTML = "🤍";
      btn.title = "Add to Favorites";
    }
  });

  // If on favorites page, re-render the list
  if (typeof displayFavorites === "function") {
    displayFavorites();
  }
}

// 5. Toast Notification System
function showToast(message, type = "default") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : type === "danger" ? "toast-danger" : ""}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  // Auto remove after 3.2 seconds
  setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}
