const express = require('express')
const app = express();
const connectDB = require('./config/db')

connectDB()

app.use(express.json({extended:false}))

app.use('/', route)

const PORT = 5000;


app.listen(PORT, () => console.log(`server running on port ${PORT}`))