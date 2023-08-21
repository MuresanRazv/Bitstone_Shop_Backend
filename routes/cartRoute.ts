import express from 'express'
import {getCartById, updateCart} from "../services/cartService.js";
import bodyParser from 'body-parser'

export const cartRouter = express.Router()
const jsonParser = bodyParser.json()

cartRouter.get('/cart', async (req: any, res: any)=> {
    const id = req.query.id
    res.json(await getCartById(id))
})

cartRouter.post('/cart', jsonParser, async (req: any, res: any) => {
    res.json(await updateCart(req.body.id, req.body.products))
})