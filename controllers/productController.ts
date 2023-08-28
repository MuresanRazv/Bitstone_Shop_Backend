import {getProductById, getProducts} from "../services/productServices";

/**
 * get the products based on parameters given in query string
 */
export function getProductsController(req: any, res: any) {
    const id = req.query.id,
        skip = req.query.skip ? req.query.skip : undefined,
        limit = req.query.limit ? req.query.limit : undefined,
        categories = req.query.categories ? req.query.categories.split(",") : undefined,
        search = req.query.search ? req.query.search : undefined

    try {
        if (id) {
            getProductById(id).then(data => res.json(data))
        } else {
            getProducts(skip, limit, categories, search).then(data => res.json(data))
        }
    } catch (err: any) {
        res.status(404).send({"message": err.message})
    }
}