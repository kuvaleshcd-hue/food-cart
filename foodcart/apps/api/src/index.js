require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/restaurants', require('./routes/restaurants'))
app.use('/api/orders', require('./routes/orders'))

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`FoodCart API running on http://localhost:${PORT}`))
