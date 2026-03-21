const otpStore = new Map()

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function saveOTP(phone, otp) {
  otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 })
}

function verifyOTP(phone, otp) {
  const entry = otpStore.get(phone)
  if (!entry) return { valid: false, reason: 'No OTP found' }
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone)
    return { valid: false, reason: 'OTP expired' }
  }
  if (entry.otp !== otp) return { valid: false, reason: 'Wrong OTP' }
  otpStore.delete(phone)
  return { valid: true }
}

module.exports = { generateOTP, saveOTP, verifyOTP }
