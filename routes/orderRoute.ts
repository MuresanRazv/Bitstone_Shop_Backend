import express from 'express'
import {verifyToken} from "../utils/authMiddleware.js";
import {addOrder, getOrderById, updateStatus} from "../controllers/orderController.js";
import OrderModel, {OrderInterface, StatusInterface} from "../models/order.js";
import {emptyCart, getCartByToken} from "../controllers/cartController.js";
import jwt from "jsonwebtoken";
import {config} from "dotenv";
import bodyParser from "body-parser";
import {getOrders} from "../controllers/userController.js";
const jsonParser = bodyParser.json()

export const ordersRouter = express.Router()

/**
 * get the token from header, verify it and the return the orders of the user which has that token
 */
ordersRouter.get('/', async (req: any, res: any) => {
    const token = req.get("Internship-Auth")
    try {
        jwt.verify(token, process.env.TOKEN_KEY!)

    } catch (err) {
        return res.status(401).send("Invalid Token")
    }

    try {
        res.json(await getOrders(token))
    } catch (err: any) {
        res.status(404).send({"message": err.message})
    }
})

/**
 * get the token from the header, verify it and then update the status of an order based on the information from the
 * body
 */
ordersRouter.post('/update', jsonParser, async (req: any, res: any) => {
    const status = req.body.status,
        id = req.body.id,
        userID = req.body.userID,
        token = req.get("Internship-Auth")

    try {
        jwt.verify(token, process.env.TOKEN_KEY!)

    } catch (err) {
        return res.status(401).send("Invalid Token")
    }

    try {
        res.json(await updateStatus(id, userID, status))
    } catch (err: any) {
        res.status(404).send({"message": err.message})
    }
})

/**
 * get the token from the header, verify it and then add the order
 */
ordersRouter.post('/add', jsonParser, async (req: any, res: any) => {
    const orderInformation = req.body.order,
        token = req.get("Internship-Auth")

    try {
        jwt.verify(token, process.env.TOKEN_KEY!)

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
        discountedTotal: cart.discountedTotal!
    }

    try {
        await emptyCart(cart.userId)
        res.json(await addOrder(order))
    } catch (err: any) {
        res.status(404).send({"message": err.message})
    }
})