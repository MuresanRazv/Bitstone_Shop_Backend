import express from 'express'
import {getProductById, getProducts} from "../controllers/productController.js";

const productsRouter = express.Router()

productsRouter.get('/product', async (req: any, res: any) => {
    const id = req.query.id
    const skip = req.query.skip ? req.query.skip: undefined
    const limit = req.query.limit ? req.query.limit: undefined
    const categories = req.query.categories ? req.query.categories.split(",") : undefined
    if (id) res.json(await getProductById(id))
    if (skip || limit || categories)
        res.json(await getProducts(skip, limit, categories))
})

export default productsRouter