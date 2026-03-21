const router = require('express').Router()
const supabase = require('../config/supabase')
const auth = require('../middleware/auth')

// POST /api/orders
router.post('/', auth, async (req, res) => {
  const { restaurant_id, items, delivery_address, payment_method = 'cod', discount = 0 } = req.body

  if (!restaurant_id || !items || !items.length || !delivery_address) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('delivery_fee')
    .eq('id', restaurant_id)
    .single()

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0)
  const delivery_fee = restaurant?.delivery_fee || 30
  const total = subtotal + delivery_fee - discount

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: req.user.id,
      restaurant_id,
      items,
      subtotal,
      delivery_fee,
      discount,
      total,
      delivery_address,
      payment_method,
      status: 'placed'
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// GET /api/orders/:id
router.get('/:id', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, restaurants(name, image_url)')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single()
  if (error) return res.status(404).json({ error: 'Order not found' })
  res.json(data)
})

// GET /api/orders (order history)
router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, restaurants(name, image_url)')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// PUT /api/orders/:id/cancel
router.put('/:id/cancel', auth, async (req, res) => {
  const { data: order } = await supabase
    .from('orders')
    .select('status')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single()

  if (!order) return res.status(404).json({ error: 'Order not found' })
  if (!['placed', 'confirmed'].includes(order.status)) {
    return res.status(400).json({ error: 'Order cannot be cancelled at this stage' })
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router
