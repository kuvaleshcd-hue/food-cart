const router = require('express').Router()
const supabase = require('../config/supabase')
const auth = require('../middleware/auth')

// GET /api/users/me
router.get('/me', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single()
  if (error) return res.status(404).json({ error: 'User not found' })
  res.json(data)
})

// PUT /api/users/me
router.put('/me', auth, async (req, res) => {
  const { name, email } = req.body
  const { data, error } = await supabase
    .from('users')
    .update({ name, email })
    .eq('id', req.user.id)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router
