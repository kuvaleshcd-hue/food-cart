const API_BASE = 'http://localhost:4000/api'

function getToken() {
  return localStorage.getItem('fc_token')
}

function setToken(token) {
  localStorage.setItem('fc_token', token)
}

function getUser() {
  const u = localStorage.getItem('fc_user')
  return u ? JSON.parse(u) : null
}

function setUser(user) {
  localStorage.setItem('fc_user', JSON.stringify(user))
}

function logout() {
  localStorage.removeItem('fc_token')
  localStorage.removeItem('fc_user')
  window.location.href = 'login.html'
}

async function apiFetch(path, options = {}) {
  const token = getToken()
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...(options.headers || {})
    }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

const API = {
  // Auth
  sendOTP: (phone) => apiFetch('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOTP: (phone, otp) => apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),

  // Restaurants
  getRestaurants: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return apiFetch('/restaurants' + (q ? '?' + q : ''))
  },
  getRestaurant: (id) => apiFetch('/restaurants/' + id),
  getMenu: (id) => apiFetch('/restaurants/' + id + '/menu'),

  // Orders
  placeOrder: (data) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => apiFetch('/orders'),
  getOrder: (id) => apiFetch('/orders/' + id),
  cancelOrder: (id) => apiFetch('/orders/' + id + '/cancel', { method: 'PUT' }),

  // User
  getMe: () => apiFetch('/users/me'),
  updateMe: (data) => apiFetch('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
}

window.API = API
window.getToken = getToken
window.setToken = setToken
window.getUser = getUser
window.setUser = setUser
window.logout = logout
