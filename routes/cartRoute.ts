import express from 'express'
import {getCartById, updateCart} from "../controllers/cartController.js";
import bodyParser from 'body-parser'

export const cartRouter = express.Router()
const jsonParser = bodyParser.json()

cartRouter.get('/', async (req: any, res: any)=> {
    const id = req.query.id
    res.json(await getCartById(id))
})

cartRouter.post('/', jsonParser, async (req: any, res: any) => {
    res.json(await updateCart(req.body.id, req.body.products))
})