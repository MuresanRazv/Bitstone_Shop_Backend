import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import {productsRouter} from "./routes/productRoute.js";
import {cartRouter} from "./routes/cartRoute.js";
import {userRouter} from "./routes/userRoute.js";
import {ordersRouter} from "./routes/orderRoute.js";
import {config} from "dotenv";
import {reviewRouter} from "./routes/reviewRoute.js";
import {returnRouter} from "./routes/returnRoute";


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/shop')
        console.log('Connection success')
    }
    catch (error) {
        console.log('Error connecting to database: ', error)
    }
}

// connect database with backend
connectDB()

// used for getting environment variables
config()

const app = express(),
    port = 3000

app.use(cors())
app.use('/products', productsRouter)
app.use('/cart', cartRouter)
app.use('/user', userRouter)
app.use('/order', ordersRouter)
app.use('/reviews', reviewRouter)
app.use('/returns', returnRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})