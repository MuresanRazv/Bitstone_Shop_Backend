import {getOrders} from "../services/userServices";
import jwt from "jsonwebtoken";
import {addOrder, updateStatus} from "../services/orderServices";
import {emptyCart, getCartByToken} from "../services/cartServices";
import OrderModel, {OrderInterface, StatusInterface} from "../models/order";

/**
 * get the token from header, verify it and the return the orders of the user which has that token
 */
export async function getOrdersController(req: any, res: any) {
    const token = req.get("Internship-Auth")
    try {
        jwt.verify(token, process.env.TOKEN_KEY!)

    } catch (err) {
        res.status(401).send({"message": "Invalid Token"})
    }

    try {
        getOrders(token).then((data) => res.json(data))
    } catch (err: any) {
        res.status(404).send({"message": err.message})
    }
}

/**
 * get the token from the header, verify it and then update the status of an order based on the information from the
 * body
 */
export async function updateStatusController(req: any, res: any) {
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
        updateStatus(id, userID, status).then((data) => res.json(data))
    } catch (err: any) {
        res.status(404).send({"message": err.message})
    }
}

/**
 * get the token from the header, verify it and then add the order
 */
export async function addOrderController(req: any, res: any) {
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
        await addOrder(order).then((data) => res.json(data))
    } catch (err: any) {
        res.status(404).send({"message": err.message})
    }
}