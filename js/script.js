const PHONE_NUMBER = "918985562963";
const CALL_NUMBER = "+918985562963";
const SWIGGY_URL = "https://www.swiggy.com/";
const ZOMATO_URL = "https://www.zomato.com/";

const REDUCED_MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");
const MOBILE_QUERY = window.matchMedia("(max-width: 980px)");

const menuData = [
  { id: "fruit-mix", name: "Fruit Mix", price: 120, desc: "Seasonal fruits, chopped and served fresh.", img: "images/fruit-mix.png" },
  { id: "chia-water", name: "Chia Water", price: 60, desc: "Hydrating chia seeds in light citrus water.", img: "images/chia-water.png" },
  { id: "oats-milk", name: "Oats + Milk", price: 90, desc: "Creamy oats with milk - wholesome breakfast.", img: "images/oats-milk.png" },
  { id: "protein-milk", name: "Protein Milk Combo (Oats + Seeds)", price: 150, desc: "Oats with mixed seeds for extra protein.", img: "images/protein-milk.png" },
  { id: "all-fruit", name: "All Fruit Combo", price: 180, desc: "A premium combo of mixed premium fruits.", img: "images/all-fruit-combo.png" },
  { id: "coconut-water-500", name: "Fresh Coconut Water (500ml)", price: 80, desc: "Naturally hydrating, served chilled.", img: "images/coconut-water.png" },
  { id: "coconut-water-1l", name: "Fresh Coconut Water (1 litre)", price: 150, desc: "Larger bottle for longer refreshment.", img: "images/coconut-water.png" },
  { id: "beetroot-juice", name: "Beetroot Juice", price: 80, desc: "Freshly pressed beetroot juice.", img: "images/beetroot-juice.png" },
  { id: "hair-growth", name: "Hair Growth Combo", price: 160, desc: "Nutrients and seeds to support hair.", img: "images/hair-growth-combo.png" },
  { id: "face-glow", name: "Face Glow Combo", price: 160, desc: "Vitamins and fruits for radiant skin.", img: "images/face-glow-combo.png" },
  { id: "jonna-rotte", name: "Jonna Rotte", price: 50, desc: "Traditional healthy flatbread.", img: "images/jonna-rotte.png" }
];

let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("hf_cart") || "{}");
  } catch {
    return {};
  }
}

function formatPrice(value) {
  return `\u20b9${value}`;
}

function markMediaLoaded(mediaWrapper) {
  if (!mediaWrapper) return;
  mediaWrapper.classList.remove("loading");
  mediaWrapper.classList.add("loaded");
}

function buildMenuCard(item, index) {
  const card = document.createElement("article");
  card.className = "card reveal";
  card.style.setProperty("--reveal-delay", `${Math.min(index * 70, 460)}ms`);

  card.innerHTML = `
    <div class="card-media loading">
      <span class="img-skeleton" aria-hidden="true"></span>
      <img src="${item.img}" alt="${item.name}" loading="lazy" decoding="async">
    </div>
    <div class="card-body">
      <h3 class="item-title">${item.name}</h3>
      <p class="item-desc">${item.desc}</p>
      <div class="small item-price">${formatPrice(item.price)}</div>
    </div>
    <div class="card-actions">
      <button class="btn btn-primary add" data-id="${item.id}">Add to Cart</button>
    </div>
  `;

  const mediaWrapper = card.querySelector(".card-media");
  const image = mediaWrapper?.querySelector("img");
  if (image) {
    const done = () => markMediaLoaded(mediaWrapper);
    if (image.complete) {
      done();
    } else {
      image.addEventListener("load", done, { once: true });
      image.addEventListener("error", done, { once: true });
    }
  }

  return card;
}

function renderMenu() {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

  grid.innerHTML = "";
  menuData.forEach((item, index) => {
    grid.appendChild(buildMenuCard(item, index));
  });
}

function animateCartFeedback(targetRect) {
  const cartToggle = document.getElementById("cartToggle");
  if (!cartToggle) return;

  cartToggle.classList.remove("pulse", "shine", "wiggle");
  void cartToggle.offsetWidth;
  cartToggle.classList.add("pulse", "shine", "wiggle");
  window.setTimeout(() => {
    cartToggle.classList.remove("pulse", "shine", "wiggle");
  }, 900);

  const plus = document.createElement("div");
  plus.className = "cart-plus";
  plus.textContent = "+1";

  const origin = targetRect || cartToggle.getBoundingClientRect();
  plus.style.left = `${origin.left + origin.width / 2 - 17}px`;
  plus.style.top = `${origin.top - 8}px`;
  document.body.appendChild(plus);

  requestAnimationFrame(() => plus.classList.add("show"));
  window.setTimeout(() => plus.remove(), 980);
}

function animateFlyToCart(card) {
  if (!card) return;

  const sourceImage = card.querySelector(".card-media img") || card.querySelector("img");
  const cartToggle = document.getElementById("cartToggle");
  if (!sourceImage || !cartToggle) return;

  const sourceRect = sourceImage.getBoundingClientRect();
  const originRect = sourceRect.width > 0 ? sourceRect : card.getBoundingClientRect();
  const cartRect = cartToggle.getBoundingClientRect();

  if (REDUCED_MOTION_QUERY.matches) {
    animateCartFeedback(cartRect);
    return;
  }

  const fly = sourceImage.cloneNode(true);
  fly.className = "flying-img";
  fly.style.left = `${originRect.left}px`;
  fly.style.top = `${originRect.top}px`;
  fly.style.width = `${originRect.width}px`;
  fly.style.height = `${originRect.height}px`;
  fly.style.opacity = "1";
  document.body.appendChild(fly);

  const fromX = originRect.left + originRect.width / 2;
  const fromY = originRect.top + originRect.height / 2;
  const toX = cartRect.left + cartRect.width / 2;
  const toY = cartRect.top + cartRect.height / 2;
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;

  const animation = fly.animate(
    [
      { transform: "translate3d(0,0,0) scale(1) rotate(0deg)", opacity: 1, offset: 0 },
      {
        transform: `translate3d(${deltaX * 0.55}px, ${deltaY * 0.48 - 95}px, 0) scale(0.72) rotate(190deg)`,
        opacity: 0.92,
        offset: 0.62
      },
      {
        transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.12) rotate(360deg)`,
        opacity: 0.08,
        offset: 1
      }
    ],
    {
      duration: 920,
      easing: "cubic-bezier(0.2,0.9,0.2,1)",
      fill: "forwards"
    }
  );

  animation.onfinish = () => {
    fly.remove();
    animateCartFeedback(cartRect);
  };
}

function saveCart() {
  localStorage.setItem("hf_cart", JSON.stringify(cart));
}

function addToCart(id) {
  if (!cart[id]) {
    const item = menuData.find((menuItem) => menuItem.id === id);
    if (!item) return;
    cart[id] = { ...item, qty: 1 };
  } else {
    cart[id].qty += 1;
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  if (!cart[id]) return;

  cart[id].qty = Math.max(0, cart[id].qty + delta);
  if (cart[id].qty === 0) {
    removeFromCart(id);
    return;
  }

  saveCart();
  updateCartUI();
}

function cartItemsArray() {
  return Object.values(cart);
}

function cartTotals() {
  const items = cartItemsArray();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  return { items, total, count };
}

function updateCartUI() {
  const { items, total, count } = cartTotals();

  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = String(count);

  const cartTotal = document.getElementById("cartTotal");
  if (cartTotal) cartTotal.textContent = formatPrice(total);

  const list = document.getElementById("cartItems");
  if (!list) return;

  list.innerHTML = "";
  if (items.length === 0) {
    list.innerHTML = '<p class="small">Your cart is empty.</p>';
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <div style="font-weight:600">${item.name}</div>
        <div class="small">${formatPrice(item.price)} x ${item.qty}</div>
      </div>
      <div class="qty-controls">
        <button class="btn btn-ghost dec" data-id="${item.id}" aria-label="Decrease quantity">-</button>
        <div>${item.qty}</div>
        <button class="btn btn-ghost inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
      </div>
    `;
    list.appendChild(row);
  });
}

function toggleCart(open) {
  const cartElement = document.getElementById("cart");
  if (!cartElement) return;

  if (typeof open === "boolean") {
    cartElement.classList.toggle("open", open);
    return;
  }

  cartElement.classList.toggle("open");
}

function buildOrderMessage(items, total) {
  const lines = [
    "Hello Healthy Foodz,",
    "I'd like to place an order:"
  ];

  items.forEach((item) => {
    lines.push(`- ${item.name} x${item.qty} = ${formatPrice(item.price * item.qty)}`);
  });

  lines.push("", `Total: ${formatPrice(total)}`, "Delivery address: (please add your address)", "Contact:");
  return lines.join("\n");
}

function sendWhatsAppOrder() {
  const { items, total } = cartTotals();
  if (items.length === 0) {
    window.alert("Cart is empty. Please add items.");
    return;
  }

  const text = buildOrderMessage(items, total);
  const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener");
}

function sendEmailOrder() {
  const { items, total } = cartTotals();
  if (items.length === 0) {
    window.alert("Cart is empty. Please add items.");
    return;
  }

  const subject = "New order from website - Healthy Foodz";
  const body = buildOrderMessage(items, total);
  window.location.href = `mailto:deekshithvoddineni@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function setupPlatformLinks() {
  const swiggy = document.getElementById("swiggyLink");
  const zomato = document.getElementById("zomatoLink");
  if (swiggy) swiggy.href = SWIGGY_URL;
  if (zomato) zomato.href = ZOMATO_URL;
}

function setupCallLinks() {
  const callHref = `tel:${CALL_NUMBER}`;

  const callButton = document.getElementById("callBtn");
  const callCheckout = document.getElementById("callCheckout");
  const footerCall = document.getElementById("footerCall");

  if (callButton) callButton.setAttribute("href", callHref);
  if (callCheckout) callCheckout.setAttribute("href", callHref);
  if (footerCall) footerCall.setAttribute("href", callHref);
}

function initHeroImageLoading() {
  const shell = document.querySelector(".hero-photo-shell");
  const image = document.getElementById("heroImage");
  if (!shell || !image) return;

  const done = () => markMediaLoaded(shell);
  if (image.complete) {
    done();
  } else {
    image.addEventListener("load", done, { once: true });
    image.addEventListener("error", done, { once: true });
  }
}

function initRevealAnimations() {
  const revealElements = [...document.querySelectorAll(".reveal, [data-reveal]")];
  if (revealElements.length === 0) return;

  if (REDUCED_MOTION_QUERY.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("show"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealElements.forEach((element, index) => {
    if (!element.style.getPropertyValue("--reveal-delay")) {
      element.style.setProperty("--reveal-delay", `${Math.min(index * 60, 320)}ms`);
    }
    observer.observe(element);
  });
}

function initHeaderState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const syncHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 8);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

function initParallax() {
  if (REDUCED_MOTION_QUERY.matches || MOBILE_QUERY.matches) return;

  const elements = [...document.querySelectorAll("[data-parallax]")];
  if (elements.length === 0) return;

  let frameId = 0;

  const update = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    elements.forEach((element) => {
      const speed = Number(element.dataset.parallax || "0.06");
      element.style.transform = `translate3d(0, ${Math.round(scrollY * speed)}px, 0)`;
    });
    frameId = 0;
  };

  const onScroll = () => {
    if (frameId !== 0) return;
    frameId = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

function initFloatingWhatsApp() {
  const floatingWhatsApp = document.getElementById("floatingWhatsApp");
  if (!floatingWhatsApp) return;

  if (!REDUCED_MOTION_QUERY.matches) {
    floatingWhatsApp.classList.add("bounce");
  }

  floatingWhatsApp.addEventListener("click", (event) => {
    event.preventDefault();
    sendWhatsAppOrder();
  });
}

function initSubscriptionBar() {
  const bar = document.getElementById("subscriptionBar");
  const closeButton = document.getElementById("subscriptionBarClose");
  const whatsappLink = document.getElementById("subscribeWhatsApp");

  try {
    if (localStorage.getItem("hf_sub_bar_closed") === "1") {
      bar?.classList.add("hidden");
    } else {
      bar?.classList.remove("hidden");
    }

    closeButton?.addEventListener("click", () => {
      bar?.classList.add("hidden");
      localStorage.setItem("hf_sub_bar_closed", "1");
    });

    if (whatsappLink) {
      const msg = "Hello Healthy Foodz, I am interested in your 30-day subscription plans. Please share details and pricing. My delivery address is: ";
      whatsappLink.setAttribute("href", `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`);
      whatsappLink.setAttribute("target", "_blank");
      whatsappLink.setAttribute("rel", "noopener");
    }
  } catch (error) {
    console.warn("subscription bar init error", error);
  }
}

function bindEvents() {
  const menuGrid = document.getElementById("menuGrid");
  const cartToggle = document.getElementById("cartToggle");
  const closeCart = document.getElementById("closeCart");
  const cartItems = document.getElementById("cartItems");
  const whatsappCheckout = document.getElementById("whatsappCheckout");
  const whatsappOrder = document.getElementById("whatsappOrder");
  const emailCheckout = document.getElementById("emailCheckout");

  menuGrid?.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add");
    if (!addButton) return;

    const card = addButton.closest(".card");
    const itemId = addButton.dataset.id;
    if (!itemId) return;

    animateFlyToCart(card);
    addToCart(itemId);
  });

  cartToggle?.addEventListener("click", () => toggleCart());
  closeCart?.addEventListener("click", () => toggleCart(false));

  cartItems?.addEventListener("click", (event) => {
    const decButton = event.target.closest(".dec");
    const incButton = event.target.closest(".inc");
    if (decButton?.dataset.id) changeQty(decButton.dataset.id, -1);
    if (incButton?.dataset.id) changeQty(incButton.dataset.id, 1);
  });

  whatsappCheckout?.addEventListener("click", sendWhatsAppOrder);
  whatsappOrder?.addEventListener("click", sendWhatsAppOrder);
  emailCheckout?.addEventListener("click", sendEmailOrder);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") toggleCart(false);
  });
}

function init() {
  document.body.classList.add("is-loading");

  renderMenu();
  updateCartUI();
  setupPlatformLinks();
  setupCallLinks();

  bindEvents();
  initHeroImageLoading();
  initRevealAnimations();
  initHeaderState();
  initFloatingWhatsApp();
  initParallax();
  initSubscriptionBar();

  requestAnimationFrame(() => {
    document.body.classList.remove("is-loading");
  });
}

document.addEventListener("DOMContentLoaded", init);
