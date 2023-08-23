import express from 'express'
import {getCartById, getCartByToken, updateCart} from "../controllers/cartController.js";
import bodyParser from 'body-parser'

export const cartRouter = express.Router()
const jsonParser = bodyParser.json()

cartRouter.get('/', async (req: any, res: any)=> {
    const token = req.get('Internship-Auth')
    res.json(await getCartByToken(token).then(data => data))
})

cartRouter.post('/', jsonParser, async (req: any, res: any) => {
    res.json(await updateCart(req.get("Internship-Auth"), req.body.products).then(data => data))
})