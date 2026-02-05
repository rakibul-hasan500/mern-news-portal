const express = require('express')
const cors = require('cors')
const connectDB = require('./config/connectDb')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()

// Port
const port = process.env.PORT

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.MODE === 'production' ? '' : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}))


// Dashboard Route
const dashboardRoute = require('./src/routes/dashboard.route')
app.use('/api/dashboard', dashboardRoute)

// Auth Route
const authRoutes = require('./src/routes/auth.route')
app.use('/api/auth', authRoutes)

// Category Route
const categoryRoutes = require('./src/routes/category.route')
app.use('/api/category', categoryRoutes)

// News Route
const newsRoute = require('./src/routes/news.route')
app.use('/api/news', newsRoute)

// Settings Route
const settingsRoute = require('./src/routes/settings.route')
app.use('/api/settings', settingsRoute)

// Comment Route
const commentRoute = require('./src/routes/comment.route')
app.use('/api/comment', commentRoute)





// Listen App
app.listen(port, ()=>{
    connectDB()
    console.log(`Server is running on port: ${port}`)
})