import jwt from "jsonwebtoken";
import {addReturn, getReturns} from "../services/returnServices";


export async function getReturnsController(req: any, res: any) {
    const token = req.get("Internship-Auth")
    try {
        jwt.verify(token, process.env.TOKEN_KEY!)
    } catch (err) {
        res.status(401).send({"message": "Invalid Token"})
    }

    try {
        getReturns(token).then(returns => res.json(returns))
    } catch (err: any) {
        res.status(400).send({"message": err.message})
    }
}

export async function addReturnController(req: any, res: any) {
    const token = req.get("Internship-Auth"),
        orderID = req.body.orderID,
        userID = req.body.userID,
        products = req.body.products
    try {
        jwt.verify(token, process.env.TOKEN_KEY!)
    } catch (err) {
        res.status(401).send({"message": "Invalid Token"})
    }

    try {
        addReturn({
            products: products,
            userID: userID,
            orderID: orderID
        }).then(returnObj => res.json(returnObj))
    } catch (err: any) {
        res.status(400).send({"message": err.message})
    }
}