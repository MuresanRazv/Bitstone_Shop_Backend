import express from 'express'
import bodyParser from 'body-parser'
import {getAllProducts, getProductById} from "../services/productsService.js";

const productsRouter = express.Router()

productsRouter.get('/product', async (req: any, res: any) => {
    const id = req.query.id
    res.json(await getProductById(id))
})

export default productsRouter