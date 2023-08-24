import express from 'express'
import {verifyToken} from "../utils/authMiddleware.js";
import {addOrder, getOrderById, updateStatus} from "../controllers/orderController.js";
import OrderModel, {OrderInterface, StatusInterface} from "../models/order.js";
import {emptyCart, getCartByToken} from "../controllers/cartController.js";
import jwt from "jsonwebtoken";
import {config} from "dotenv";
import bodyParser from "body-parser";
const jsonParser = bodyParser.json()

export const ordersRouter = express.Router()

ordersRouter.get('/', verifyToken, async (req: any, res: any) => {
    const id = req.query.id,
        userID = req.query.userId

    try {
        res.json(await getOrderById(id, userID))
    } catch (err: any) {
        res.status(404).send({"message": err.message})
    }
})

ordersRouter.post('/update', verifyToken, async (req: any, res: any) => {
    const status = req.body.status,
        id = req.body.id,
        userID = req.body.userID

    try {
        res.json(await updateStatus(id, userID, status))
    } catch (err: any) {
        res.status(404).send({"message": err.message})
    }
})

ordersRouter.post('/add', jsonParser, async (req: any, res: any) => {
    config()
    const orderInformation = req.body.order,
        token = req.get("Internship-Auth")

    try {
        jwt.verify(token, process.env.TOKEN_KEY as string)

    } catch (err) {
        return res.status(401).send("Invalid Token")
    }

    const cart = await getCartByToken(token)
    let status: StatusInterface = {
        status: "Order initiated",
        date: new Date().toISOString()
    }

    const order: OrderInterface = {
        products: cart.products,
        zip: orderInformation.zip,
        date: new Date().toISOString(),
        city: orderInformation.city,
        county: orderInformation.county,
        userID: cart.userId,
        id: await OrderModel.count() + 1,
        street: orderInformation.street,
        status: [status],
        discountedTotal: cart.discountedTotal as number
    }
    await emptyCart(cart.userId)

    try {
        res.json(await addOrder(order))
    } catch (err: any) {
        res.status(404).send({"message": err.message})
    }
})