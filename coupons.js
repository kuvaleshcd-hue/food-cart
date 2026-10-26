// coupons.js — Coupons & Promo Codes Engine for Food Cart

export const AVAILABLE_COUPONS = [
  {
    code: 'WELCOME30',
    title: '30% OFF up to ₹150',
    description: 'Special welcome discount for hungry foodies',
    minOrder: 199,
    discountType: 'percent',
    discountVal: 30,
    maxDiscount: 150,
    badge: 'Popular',
    icon: '🎉'
  },
  {
    code: 'FEAST50',
    title: 'Flat ₹50 OFF',
    description: 'Save ₹50 on delicious meals above ₹299',
    minOrder: 299,
    discountType: 'flat',
    discountVal: 50,
    badge: 'Trending',
    icon: '🍕'
  },
  {
    code: 'FREEDEL',
    title: 'Free Delivery',
    description: 'Zero delivery fee on orders above ₹149',
    minOrder: 149,
    discountType: 'freedel',
    discountVal: 40,
    badge: 'Zero Fee',
    icon: '🚀'
  },
  {
    code: 'SUPER100',
    title: 'Flat ₹100 OFF',
    description: 'Mega group feast discount on orders above ₹499',
    minOrder: 499,
    discountType: 'flat',
    discountVal: 100,
    badge: 'Best Value',
    icon: '💰'
  },
  {
    code: 'TASTY10',
    title: '10% OFF up to ₹50',
    description: 'Instant snack savings with no minimum order',
    minOrder: 0,
    discountType: 'percent',
    discountVal: 10,
    maxDiscount: 50,
    badge: 'No Min',
    icon: '🍔'
  }
];

export function findCoupon(code) {
  if (!code) return null;
  const clean = code.trim().toUpperCase();
  return AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === clean) || null;
}

export function validateCoupon(code, subtotal) {
  if (!code) {
    return { valid: false, reason: 'Please enter a coupon code.' };
  }
  const coupon = findCoupon(code);
  if (!coupon) {
    return { valid: false, reason: `Coupon "${code.toUpperCase()}" is invalid.` };
  }
  if (subtotal < coupon.minOrder) {
    const diff = coupon.minOrder - subtotal;
    return {
      valid: false,
      coupon,
      reason: `Add ₹${diff} more items to use "${coupon.code}" (Min: ₹${coupon.minOrder})`
    };
  }

  let discount = 0;
  let isFreeDelivery = false;

  if (coupon.discountType === 'percent') {
    discount = Math.round((subtotal * coupon.discountVal) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === 'flat') {
    discount = coupon.discountVal;
  } else if (coupon.discountType === 'freedel') {
    discount = coupon.discountVal; // saves delivery fee
    isFreeDelivery = true;
  }

  // Discount cannot exceed subtotal
  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    coupon,
    discount,
    isFreeDelivery
  };
}

export function calculateBill(subtotal, couponCode = null) {
  if (subtotal <= 0) {
    return {
      subtotal: 0,
      deliveryFee: 0,
      packagingFee: 0,
      discount: 0,
      grandTotal: 0,
      appliedCoupon: null,
      isFreeDelivery: false,
      savings: 0
    };
  }

  const baseDeliveryFee = 40;
  const packagingFee = 10;
  let deliveryFee = subtotal >= 299 ? 0 : baseDeliveryFee;
  let discount = 0;
  let appliedCoupon = null;
  let isFreeDelivery = subtotal >= 299;

  if (couponCode) {
    const check = validateCoupon(couponCode, subtotal);
    if (check.valid) {
      appliedCoupon = check.coupon;
      if (check.isFreeDelivery) {
        discount = deliveryFee; // waive delivery fee if applicable
        deliveryFee = 0;
        isFreeDelivery = true;
      } else {
        discount = check.discount;
      }
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee + packagingFee - discount);
  const savings = discount + (subtotal >= 299 && (!appliedCoupon || appliedCoupon.discountType !== 'freedel') ? 40 : 0);

  return {
    subtotal,
    deliveryFee,
    packagingFee,
    discount,
    grandTotal,
    appliedCoupon,
    isFreeDelivery,
    savings
  };
}

export function getSavedCoupon() {
  return localStorage.getItem('demoAppliedCoupon') || null;
}

export function saveAppliedCoupon(code) {
  if (code) {
    localStorage.setItem('demoAppliedCoupon', code.trim().toUpperCase());
  } else {
    localStorage.removeItem('demoAppliedCoupon');
  }
}

export function clearAppliedCoupon() {
  localStorage.removeItem('demoAppliedCoupon');
}

export function triggerConfetti() {
  if (typeof window !== 'undefined' && typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// Make accessible to non-module scripts if needed
if (typeof window !== 'undefined') {
  window.FoodCartCoupons = {
    AVAILABLE_COUPONS,
    findCoupon,
    validateCoupon,
    calculateBill,
    getSavedCoupon,
    saveAppliedCoupon,
    clearAppliedCoupon,
    triggerConfetti
  };
}
