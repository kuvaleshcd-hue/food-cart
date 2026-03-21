// cart.js — shared cart utility
// Usage: import { addToCart, updateCartUI, clearCart } from './cart.js'
// OR just include as <script src="cart.js"></script> on pages with cart panel HTML

let cart = JSON.parse(localStorage.getItem('demoCart') || '{}');

export function saveCart() {
  localStorage.setItem('demoCart', JSON.stringify(cart));
}

export function getCart() {
  return cart;
}

export function addToCart(item) {
  if (!cart[item.id]) cart[item.id] = { ...item, qty: 0 };
  cart[item.id].qty++;
  updateCartUI();
  saveCart();
  const btn = document.getElementById('cartBtn');
  if (btn) {
    btn.classList.add('animate-pulse');
    setTimeout(() => btn.classList.remove('animate-pulse'), 400);
  }
}

export function clearCart() {
  cart = {};
  updateCartUI();
  saveCart();
}

export function updateCartUI() {
  const itemsDiv = document.getElementById('cartItems');
  const countEl  = document.getElementById('cartCount');
  const totalEl  = document.getElementById('cartTotal');
  if (!itemsDiv) return;

  itemsDiv.innerHTML = '';
  let total = 0, count = 0;

  Object.values(cart).forEach(it => {
    total += it.price * it.qty;
    count += it.qty;
    const row = document.createElement('div');
    row.className = 'flex justify-between items-center text-sm';
    row.innerHTML = `<span>${it.name} ×${it.qty}</span><span>₹${it.price * it.qty}</span>`;
    itemsDiv.appendChild(row);
  });

  if (totalEl) totalEl.textContent = total;
  if (countEl) countEl.textContent = count;
}

// Auto-wire cart panel buttons when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  const cartBtn     = document.getElementById('cartBtn');
  const closeBtn    = document.getElementById('closeCartPanel');
  const clearBtn    = document.getElementById('clearCart');
  const checkoutBtn = document.getElementById('goToCheckout');
  const cartPanel   = document.getElementById('cartPanel');

  if (cartBtn && cartPanel)
    cartBtn.addEventListener('click', () => cartPanel.classList.toggle('hidden'));
  if (closeBtn && cartPanel)
    closeBtn.addEventListener('click', () => cartPanel.classList.add('hidden'));
  if (clearBtn)
    clearBtn.addEventListener('click', clearCart);
  if (checkoutBtn)
    checkoutBtn.addEventListener('click', () => window.location.href = 'cart.html');
});
