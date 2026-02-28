// script.js – floating panel toggle, wishlist count, product selection, and hamburger menu

document.addEventListener('DOMContentLoaded', function() {
  // ---------- Floating panel toggle (existing) ----------
  const floatingToggle = document.getElementById('floatingToggle');
  const panel = document.getElementById('categoryPanel');
  const closeBtn = document.getElementById('closePanel');
  const toggleArrow = document.getElementById('toggleArrow');

  function openPanel() {
    panel.classList.add('open');
    toggleArrow.textContent = '❮';
  }

  function closePanel() {
    panel.classList.remove('open');
    toggleArrow.textContent = '❯';
  }

  floatingToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    if (panel.classList.contains('open')) {
      closePanel();
    } else {
      openPanel();
    }
  });

  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closePanel();
  });

  // ---------- Hamburger menu toggle (new for mobile) ----------
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function() {
      mainNav.classList.toggle('open');
      // Optional: change hamburger icon (e.g., to "✕" when open)
      this.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
    });

    // Close menu when a link is clicked (optional, improves UX)
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        hamburger.textContent = '☰';
      });
    });
  }
});

//==============WISHLIST COUNT SYSTEM==============//
const WISHLIST_KEYS = [
  'aspirantWishlist_ankles',
  'aspirantWishlist_bangles',
  'aspirantWishlist_bridal',
  'aspirantWishlist_earring',
  'aspirantWishlist_engagement',
  'aspirantWishlist_hair',
  'aspirantWishlist_jhumki',
  'aspirantWishlist_kids',
  'aspirantWishlist_mens',
  'aspirantWishlist_necklace',
  'aspirantWishlist_ring',
  'aspirantWishlist_spiritual'
];

function getTotalWishlistCount(){
  let total = 0;
  WISHLIST_KEYS.forEach(key => {
    try {
      const items = JSON.parse(localStorage.getItem(key)) || [];
      total += items.length;
    } catch {}
  });
  return total;
}

document.addEventListener("DOMContentLoaded", function() {
  const countElement = document.getElementById("wishlist-count");
  if (countElement) {
    countElement.textContent = getTotalWishlistCount();
  }
});

// ============================================
// UNIFIED PRODUCT SELECTION FOR ALL CATEGORIES
// ============================================
(function() {
  const categoryName = document.body.getAttribute("data-category") || "General";

  function extractPrice(priceString) {
    const cleaned = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  }

  function buildDescription(card) {
    const hiddenDetails = card.querySelector('.hidden-details');
    if (hiddenDetails) {
      const items = hiddenDetails.querySelectorAll('.detail-item');
      return Array.from(items).map(item => item.innerText.trim()).join(' | ');
    }
    const shortDesc = card.querySelector('.product-short-desc');
    return shortDesc ? shortDesc.innerText.trim() : '';
  }

  function selectProduct(productData) {
    localStorage.removeItem('selectedProduct');
    localStorage.setItem('selectedProduct', JSON.stringify(productData));
    window.location.href = 'checkout.html';
  }

  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const nameEl = card.querySelector('.product-name');
    const name = nameEl ? nameEl.innerText.trim() : '';

    const idEl = card.querySelector('.product-id');
    let id = '';
    if (idEl) {
      const idText = idEl.innerText.trim();
      const colonIndex = idText.indexOf(':');
      id = colonIndex !== -1 ? idText.substring(colonIndex + 1).trim() : idText;
    }

    const priceEl = card.querySelector('.product-price');
    const priceString = priceEl ? priceEl.innerText.trim() : '0';
    const price = extractPrice(priceString);

    const imgContainer = card.querySelector('.image-container');
    const img = imgContainer ? imgContainer.querySelector('img') : null;
    const image = img ? img.src : '';

    const description = buildDescription(card);

    const productData = {
      name: name,
      id: id,
      price: price,
      image: image,
      description: description,
      category: categoryName
    };

    if (imgContainer) {
      imgContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('wishlist-heart')) return;
        e.preventDefault();
        selectProduct(productData);
      });
    }

    const buyBtn = card.querySelector('.buy-btn');
    if (buyBtn) {
      buyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        selectProduct(productData);
      });
    }
  });
})();