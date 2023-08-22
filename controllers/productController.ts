import ProductModel, {ProductInterface} from "../models/product.js";

export async function getAllProducts() {
    let query = await ProductModel.findOne({}, {"_id": 0}).where('price').gt(1).exec().then((data) => data)
    return JSON.stringify(query)
}

export async function getProductById(id: number): Promise<ProductInterface> {
    return await ProductModel.find({"id": id}, {"_id": 0}).then((data) => data[0] as ProductInterface)
}