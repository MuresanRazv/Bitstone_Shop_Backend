import express from 'express'
import {getCartById} from "../services/cartService.js";

export const cartRouter = express.Router()

cartRouter.get('/cart', async (req: any, res: any)=> {
    const id = req.query.id
    res.json(await getCartById(id))
})