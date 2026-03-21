const router = require('express').Router()
const supabase = require('../config/supabase')

// GET /api/restaurants
router.get('/', async (req, res) => {
  const { cuisine, veg, sort = 'rating', city = 'Hubballi' } = req.query

  let query = supabase
    .from('restaurants')
    .select('*')
    .eq('city', city)

  if (veg === 'true') query = query.eq('is_veg', true)
  if (cuisine) query = query.contains('cuisine', [cuisine])
  if (sort === 'rating') query = query.order('rating', { ascending: false })
  if (sort === 'delivery_time') query = query.order('delivery_time_min', { ascending: true })
  if (sort === 'delivery_fee') query = query.order('delivery_fee', { ascending: true })

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET /api/restaurants/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', req.params.id)
    .single()
  if (error) return res.status(404).json({ error: 'Restaurant not found' })
  res.json(data)
})

// GET /api/restaurants/:id/menu
router.get('/:id/menu', async (req, res) => {
  const { data: categories, error: catError } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('restaurant_id', req.params.id)
    .order('sort_order')

  if (catError) return res.status(500).json({ error: catError.message })

  const { data: items, error: itemError } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', req.params.id)
    .eq('is_available', true)

  if (itemError) return res.status(500).json({ error: itemError.message })

  const menu = categories.map(cat => ({
    ...cat,
    items: items.filter(item => item.category_id === cat.id)
  }))

  res.json(menu)
})

module.exports = router
