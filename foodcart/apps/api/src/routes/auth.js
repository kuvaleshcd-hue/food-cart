const router = require('express').Router()
const jwt = require('jsonwebtoken')
const supabase = require('../config/supabase')
const { generateOTP, saveOTP, verifyOTP } = require('../lib/otp')

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body
  if (!phone) return res.status(400).json({ error: 'Phone required' })

  const otp = generateOTP()
  saveOTP(phone, otp)

  // In dev, we return the OTP directly (no SMS). In prod, plug in Twilio here.
  console.log(`OTP for ${phone}: ${otp}`)
  res.json({ message: 'OTP sent', ...(process.env.NODE_ENV === 'development' && { otp }) })
})

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' })

  const result = verifyOTP(phone, otp)
  if (!result.valid) return res.status(400).json({ error: result.reason })

  // Upsert user in Supabase
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single()

  let user = existing
  if (!user) {
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ phone, created_at: new Date().toISOString() })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    user = newUser
  }

  const token = jwt.sign(
    { id: user.id, phone: user.phone },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({ token, user })
})

module.exports = router
