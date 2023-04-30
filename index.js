require('dotenv').config({path:'./config/config.env'})
const express = require('express')
const cors = require('cors')
const connection = require('./utils/dbConnection')
const userRoutes = require('./routes/user')
const paymentRoutes = require('./routes/payment')
const movieRoutes = require('./routes/movie')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//apis
app.use('/api',userRoutes)
app.use('/api',paymentRoutes)
app.use('/api',movieRoutes)

const port = process.env.PORT
app.listen(port,() => {
    console.log(`listening on port:${port}`)
})