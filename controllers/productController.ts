import ProductModel, {ProductInterface} from "../models/product.js";
/**
 *
 * @param id - id of a product
 *
 * makes a database query which finds and returns a product by id
 *
 */
export async function getProductById(id: number): Promise<ProductInterface> {
    return ProductModel.find({"id": id}, {"_id": 0}).then((data) => data[0])
}

/**
 *
 * @param skip - number of products to skip
 * @param limit - number of products to return
 * @param categories - array of categories
 * @param input - an input to search products by their title and description
 *
 * this function is used to various queries to the database of products such as: getting a certain number of products or
 * getting products by a certain input or any number of categories
 *
 */
export async function getProducts(skip: number = 0, limit: number = 0, categories: string[] = [], input: string = ""): Promise<ProductInterface[]> {
    let mongoose_categories = categories.map(category => ({category: category}))

    if (categories.length > 0) {
        return ProductModel.find({ $and: [
                { $or: mongoose_categories },
                { $or: [{"title": {$regex: `${input}`, $options: "i"}}, {"description": {$regex: `${input}`, $options: "i"}}] }
            ]})
            .skip(skip)
            .limit(limit)
    } else {
        return ProductModel.find({ $or: [{"title": {$regex: `${input}`, $options: "i"}}, {"description": {$regex: `${input}`, $options: "i"}}] })
    }
}