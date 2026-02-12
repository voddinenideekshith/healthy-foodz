const PHONE_NUMBER = '918985562963'; // WhatsApp number (country code + number, no +)
const CALL_NUMBER = '+918985562963'; // Phone number with +country code

const menuData = [
  {id: 'fruit-mix', name: 'Fruit Mix', price: 120, desc: 'Seasonal fruits, chopped and served fresh.', img: 'images/fruit-mix.png'},
  {id: 'chia-water', name: 'Chia Water', price: 60, desc: 'Hydrating chia seeds in light citrus water.', img: 'images/chia-water.png'},
  {id: 'oats-milk', name: 'Oats + Milk', price: 90, desc: 'Creamy oats with milk — wholesome breakfast.', img: 'images/oats-milk.png'},
  {id: 'protein-milk', name: 'Protein Milk Combo (Oats + Seeds)', price: 150, desc: 'Oats with mixed seeds for extra protein.', img: 'images/protein-milk.png'},
  {id: 'all-fruit', name: 'All Fruit Combo', price: 180, desc: 'A premium combo of mixed premium fruits.', img: 'images/all-fruit-combo.png'},
  {id: 'coconut-water-500', name: 'Fresh Coconut Water (500ml)', price: 80, desc: 'Naturally hydrating, served chilled.', img: 'images/coconut-water.png'},
  {id: 'coconut-water-1l', name: 'Fresh Coconut Water (1 litre)', price: 150, desc: 'Larger bottle for longer refreshment.', img: 'images/coconut-water.png'},
  {id: 'beetroot-juice', name: 'Beetroot Juice', price: 80, desc: 'Freshly pressed beetroot juice.', img: 'images/beetroot-juice.png'},
  {id: 'hair-growth', name: 'Hair Growth Combo', price: 160, desc: 'Nutrients and seeds to support hair.', img: 'images/hair-growth-combo.png'},
  {id: 'face-glow', name: 'Face Glow Combo', price: 160, desc: 'Vitamins and fruits for radiant skin.', img: 'images/face-glow-combo.png'},
  {id: 'jonna-rotte', name: 'Jonna Rotte', price: 50, desc: 'Traditional healthy flatbread.', img: 'images/jonna-rotte.png'}
];

let cart = JSON.parse(localStorage.getItem('hf_cart') || '{}');

function formatPrice(n){return `₹${n}`}

function renderMenu(){
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';
  menuData.forEach(item =>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" loading="lazy">
      <div class="card-body">
        <h5 class="item-title">${item.name}</h5>
        <p class="item-desc">${item.desc}</p>
        <div class="small item-price">${formatPrice(item.price)}</div>
      </div>
      <div class="card-actions">
        <button class="btn btn-primary add" data-id="${item.id}">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function saveCart(){localStorage.setItem('hf_cart', JSON.stringify(cart));}

function addToCart(id){
  if(!cart[id]){const item = menuData.find(m=>m.id===id);cart[id]={...item,qty:1};}
  else cart[id].qty++;
  saveCart(); updateCartUI();
}

function removeFromCart(id){delete cart[id]; saveCart(); updateCartUI();}

function changeQty(id, delta){ if(!cart[id]) return; cart[id].qty = Math.max(0, cart[id].qty + delta); if(cart[id].qty===0) removeFromCart(id); else {saveCart(); updateCartUI();} }

function cartItemsArray(){return Object.values(cart)}

function cartTotals(){
  const items = cartItemsArray();
  const total = items.reduce((s,i)=>s + i.price * i.qty,0);
  const count = items.reduce((s,i)=>s + i.qty,0);
  return {items,total,count};
}

function updateCartUI(){
  const {items,total,count} = cartTotals();
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = formatPrice(total);
  const list = document.getElementById('cartItems'); list.innerHTML = '';
  if(items.length===0){ list.innerHTML = '<p class="small">Your cart is empty.</p>'; }
  items.forEach(i=>{
    const el = document.createElement('div'); el.className='cart-item';
    el.innerHTML = `
      <div>
        <div style="font-weight:600">${i.name}</div>
        <div class="small">${formatPrice(i.price)} × ${i.qty}</div>
      </div>
      <div class="qty-controls">
        <button class="btn btn-ghost dec" data-id="${i.id}">-</button>
        <div>${i.qty}</div>
        <button class="btn btn-ghost inc" data-id="${i.id}">+</button>
      </div>
    `;
    list.appendChild(el);
  });
}

function toggleCart(open){
  const cartEl = document.getElementById('cart');
  cartEl.classList.toggle('open', open===undefined? !cartEl.classList.contains('open') : open);
}

function sendWhatsAppOrder(){
  const {items,total} = cartTotals();
  if(items.length===0){ alert('Cart is empty. Please add items.'); return; }
  let text = `Hello Healthy Foodz,%0AI'd like to place an order:%0A`;
  items.forEach(i=>{ text += `- ${i.name} x${i.qty} = ₹${i.price*i.qty}%0A`; });
  text += `%0ATotal: ₹${total}%0A`;
  text += `Delivery address: (please add your address)%0AContact: `;
  const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url,'_blank');
}

function sendEmailOrder(){
  const EMAIL = 'deekshithvoddineni@gmail.com';
  const {items,total} = cartTotals();
  if(items.length===0){ alert('Cart is empty. Please add items.'); return; }
  let body = `Hello Healthy Foodz,%0AI'd like to place an order:%0A`;
  items.forEach(i=>{ body += `- ${i.name} x${i.qty} = ₹${i.price*i.qty}%0A`; });
  body += `%0ATotal: ₹${total}%0A`;
  body += `Delivery address: (please add your address)%0AContact: `;
  const subject = `New order from website - Healthy Foodz`;
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

function init(){
  renderMenu();
  updateCartUI();

  document.getElementById('menuGrid').addEventListener('click', e=>{
    const btn = e.target.closest('.add'); if(!btn) return; addToCart(btn.dataset.id);
  });

  document.getElementById('cartToggle').addEventListener('click', ()=> toggleCart(true));
  document.getElementById('closeCart').addEventListener('click', ()=> toggleCart(false));

  document.getElementById('cartItems').addEventListener('click', e=>{
    const dec = e.target.closest('.dec'); const inc = e.target.closest('.inc');
    if(dec) changeQty(dec.dataset.id, -1);
    if(inc) changeQty(inc.dataset.id, +1);
  });

  document.getElementById('whatsappCheckout').addEventListener('click', sendWhatsAppOrder);
  document.getElementById('whatsappOrder').addEventListener('click', sendWhatsAppOrder);

  const emailBtn = document.getElementById('emailCheckout');
  if(emailBtn) emailBtn.addEventListener('click', sendEmailOrder);

  // Floating whatsapp button
  document.getElementById('floatingWhatsApp').addEventListener('click', (e)=>{ e.preventDefault(); sendWhatsAppOrder(); });

  // Call buttons
  const callHref = `tel:${CALL_NUMBER}`;
  document.getElementById('callBtn').setAttribute('href', callHref);
  document.getElementById('callCheckout').setAttribute('href', callHref);

}

document.addEventListener('DOMContentLoaded', init);
