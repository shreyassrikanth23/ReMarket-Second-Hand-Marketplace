/* ==========================================================================
   ReMarket - Sample Data & localStorage Helpers
   File: js/data.js
   Beginner-friendly data handling using localStorage and JSON
   ========================================================================== */

// 1. Initial 10 Realistic Sample Products across multiple categories
const INITIAL_PRODUCTS = [
  {
    id: "PROD-101",
    name: "Sony WH-1000XM4 Noise Canceling Headphones",
    category: "Electronics",
    price: 13500,
    condition: "Like New",
    description: "Barely used for 2 months. Active Noise Cancellation works flawlessly. Comes with original packaging, travel case, USB-C cable and aux connector. Great battery life of 30 hours.",
    location: "Koramangala, Bangalore",
    sellerName: "Aarav Sharma",
    sellerEmail: "aarav.sharma@example.com",
    sellerPhone: "9876543210",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80",
    status: "Available",
    isUserListing: false,
    createdAt: "2026-09-28"
  },
  {
    id: "PROD-102",
    name: "Apple iPhone 13 128GB Midnight",
    category: "Mobiles",
    price: 33999,
    condition: "Excellent",
    description: "Battery health 88%. Screen protector and Spigen tough armor case installed from day one. No dents or scratches. FaceID and cameras function smoothly. Bill and box included.",
    location: "Indiranagar, Bangalore",
    sellerName: "Priya Nair",
    sellerEmail: "priya.nair@example.com",
    sellerPhone: "9812345678",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&auto=format&fit=crop&q=80",
    status: "Available",
    isUserListing: false,
    createdAt: "2026-10-01"
  },
  {
    id: "PROD-103",
    name: "Dell Inspiron 15 Core i5 16GB RAM 512GB SSD",
    category: "Laptops",
    price: 28500,
    condition: "Good",
    description: "Ideal laptop for college coursework, programming and multitasking. Features Intel Core i5 11th Gen, 16GB dual channel RAM, FHD anti-glare display, and 3-hour battery backup. Original 65W charger provided.",
    location: "HSR Layout, Bangalore",
    sellerName: "Rohan Varma",
    sellerEmail: "rohan.varma@example.com",
    sellerPhone: "9741258963",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&auto=format&fit=crop&q=80",
    status: "Available",
    isUserListing: false,
    createdAt: "2026-10-02"
  },
  {
    id: "PROD-104",
    name: "Ergonomic High-Back Mesh Study & Office Chair",
    category: "Furniture",
    price: 3600,
    condition: "Excellent",
    description: "Breathable Korean mesh back with adjustable lumbar support, 2D armrests and smooth class-4 hydraulic gas lift. Cleaned and sanitized. Moving out of hostel so selling quickly.",
    location: "Electronic City, Bangalore",
    sellerName: "Sneha Patil",
    sellerEmail: "sneha.patil@example.com",
    sellerPhone: "9988776655",
    imageUrl: "https://images.unsplash.com/photo-1580481077195-c3a8a30ef758?w=700&auto=format&fit=crop&q=80",
    status: "Available",
    isUserListing: false,
    createdAt: "2026-10-03"
  },
  {
    id: "PROD-105",
    name: "Computer Science Engineering Core Textbooks (Set of 5)",
    category: "Books",
    price: 850,
    condition: "Good",
    description: "Standard syllabus bundle including Cormen Algorithms (CLRS), Tanenbaum Operating Systems, Korth Database System Concepts, and Computer Networks. Clean pages with minimal pencil highlights.",
    location: "Campus Block C, College Hostel",
    sellerName: "Karthik Rajan",
    sellerEmail: "karthik.rajan@example.com",
    sellerPhone: "9845012345",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=700&auto=format&fit=crop&q=80",
    status: "Available",
    isUserListing: false,
    createdAt: "2026-10-04"
  },
  {
    id: "PROD-106",
    name: "Hero Sprint Pro 21-Speed Mountain Bicycle",
    category: "Bikes",
    price: 6800,
    condition: "Like New",
    description: "Rigid alloy frame, dual disc brakes, Shimano 21-speed gears, front suspension fork. Used only for commuting around the college campus for one semester. Free bell and combo wire lock included.",
    location: "Jayanagar, Bangalore",
    sellerName: "Devendra Singh",
    sellerEmail: "devendra.s@example.com",
    sellerPhone: "9731456789",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=700&auto=format&fit=crop&q=80",
    status: "Available",
    isUserListing: false,
    createdAt: "2026-10-05"
  },
  {
    id: "PROD-107",
    name: "Yonex Astrox 77 Badminton Racket with Cover",
    category: "Sports",
    price: 2100,
    condition: "Like New",
    description: "High modulus graphite shaft, strung with BG65 titanium string at 25 lbs tension. Excellent smash power and maneuverability. Comes with padded full cover. Free grip tape included.",
    location: "BTM Layout, Bangalore",
    sellerName: "Manish Reddy",
    sellerEmail: "manish.r@example.com",
    sellerPhone: "9900112233",
    imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=700&auto=format&fit=crop&q=80",
    status: "Available",
    isUserListing: false,
    createdAt: "2026-10-05"
  },
  {
    id: "PROD-108",
    name: "Levi's Classic Vintage Denim Jacket (Size L)",
    category: "Fashion",
    price: 1450,
    condition: "Good",
    description: "Authentic Levi Strauss denim jacket in medium wash blue. 100% durable cotton, sturdy metal shank buttons. Freshly dry-cleaned. Perfect layered outerwear.",
    location: "Malleshwaram, Bangalore",
    sellerName: "Ananya Joshi",
    sellerEmail: "ananya.j@example.com",
    sellerPhone: "9844332211",
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=700&auto=format&fit=crop&q=80",
    status: "Available",
    isUserListing: false,
    createdAt: "2026-10-06"
  },
  {
    id: "PROD-109",
    name: "Casio CTK-3500 61-Key Portable Keyboard",
    category: "Other",
    price: 5200,
    condition: "Like New",
    description: "Touch-sensitive 61 piano-style keys, 400 tones, 100 rhythms, pitch bend wheel and USB MIDI connectivity for music production software. Includes power adapter and sheet music stand.",
    location: "Whitefield, Bangalore",
    sellerName: "Vikram Sen",
    sellerEmail: "vikram.sen@example.com",
    sellerPhone: "9880011223",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=700&auto=format&fit=crop&q=80",
    status: "Available",
    isUserListing: false,
    createdAt: "2026-10-07"
  },
  {
    id: "PROD-110",
    name: "Samsung Galaxy Watch 4 Classic 46mm Bluetooth",
    category: "Mobiles",
    price: 5900,
    condition: "Excellent",
    description: "Rotating bezel model running WearOS. Tracks ECG, Blood Pressure, body composition, sleep and workout analytics. Comes with original magnetic puck charger and spare silicone sports band.",
    location: "Hebbal, Bangalore",
    sellerName: "Naveen Rao",
    sellerEmail: "naveen.rao@example.com",
    sellerPhone: "9742334455",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80",
    status: "Available",
    isUserListing: false,
    createdAt: "2026-10-07"
  }
];

// Sample past purchase for demonstration in "My Purchases"
const INITIAL_PURCHASES = [
  {
    transactionId: "TXN-849201",
    productId: "PROD-DEMO",
    productName: "Logitech MX Master 3S Wireless Mouse",
    price: 4999,
    sellerName: "Aarav Sharma",
    sellerEmail: "aarav.sharma@example.com",
    sellerPhone: "9876543210",
    buyerName: "College Demo User",
    purchaseDate: "2026-10-06, 04:15 PM",
    status: "Completed",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=700&auto=format&fit=crop&q=80"
  }
];

// 2. Initialize localStorage with default data if empty
function initializeData() {
  if (!localStorage.getItem("remarket_products")) {
    localStorage.setItem("remarket_products", JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem("remarket_purchases")) {
    localStorage.setItem("remarket_purchases", JSON.stringify(INITIAL_PURCHASES));
  }
  if (!localStorage.getItem("remarket_favorites")) {
    localStorage.setItem("remarket_favorites", JSON.stringify(["PROD-101", "PROD-106"]));
  }
}

// 3. Helper functions to read and write Products
function getStoredProducts() {
  const data = localStorage.getItem("remarket_products");
  return data ? JSON.parse(data) : [];
}

function saveStoredProducts(products) {
  localStorage.setItem("remarket_products", JSON.stringify(products));
}

// 4. Helper functions to read and write Purchases
function getStoredPurchases() {
  const data = localStorage.getItem("remarket_purchases");
  return data ? JSON.parse(data) : [];
}

function saveStoredPurchases(purchases) {
  localStorage.setItem("remarket_purchases", JSON.stringify(purchases));
}

// 5. Helper functions to read and write Favorites
function getStoredFavorites() {
  const data = localStorage.getItem("remarket_favorites");
  return data ? JSON.parse(data) : [];
}

function saveStoredFavorites(favorites) {
  localStorage.setItem("remarket_favorites", JSON.stringify(favorites));
}

// 6. Utility: Format currency (e.g. 13500 -> ₹13,500)
function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

// Auto-run initialization when data.js loads
initializeData();
