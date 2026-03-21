// sw.js — offline caching for Food Cart PWA
const CACHE_NAME = 'foodcart-v2';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/hotels.html',
  '/menu.html',
  '/cart.html',
  '/orders.html',
  '/profile.html',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/gsap@3/dist/gsap.min.js',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.js',
  'https://unpkg.com/swiper@8/swiper-bundle.min.css',
  'https://unpkg.com/swiper@8/swiper-bundle.min.js',
  'https://unpkg.com/vanilla-tilt@1.7.2/dist/vanilla-tilt.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Don't intercept Firebase or Firestore requests — always fetch live
  if(event.request.url.includes('firebase') || event.request.url.includes('firestore')){
    return;
  }
  event.respondWith(
    caches.match(event.request).then(resp =>
      resp || fetch(event.request).catch(() =>
        new Response('<h1>Offline</h1><p>You are offline. Please reconnect.</p>',
          { headers: { 'Content-Type': 'text/html' } })
      )
    )
  );
});
