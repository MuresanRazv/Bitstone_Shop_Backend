import mongoose from 'mongoose'
import express from 'express'
import productsRouter from "./routes/productRoute.js";
import {cartRouter} from "./routes/cartRoute.js";
import {userRouter} from "./routes/userRoute.js";

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/shop')
        console.log('Connection success')
    }
    catch (error) {
        console.log('Error connecting to database: ', error)
    }
}

connectDB()

const app = express(),
    port = 3000

app.use('/products', productsRouter)
app.use('/', cartRouter)
app.use('/', userRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})