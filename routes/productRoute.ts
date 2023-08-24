import express from 'express'
import {getProductById, getProducts} from "../controllers/productController.js";

const productsRouter = express.Router()

productsRouter.get('/product', async (req: any, res: any) => {
    const id = req.query.id,
        skip = req.query.skip ? req.query.skip : undefined,
        limit = req.query.limit ? req.query.limit : undefined,
        categories = req.query.categories ? req.query.categories.split(",") : undefined,
        search = req.query.search ? req.query.search : undefined

    try {
        if (id) {
            res.json(await getProductById(id).then(data => data))
        } else {
            res.json(await getProducts(skip, limit, categories, search).then(data => data))
        }
    } catch (err: any) {
        res.status(404).send({"message": err.message})
    }
})

export default productsRouter