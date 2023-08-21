import ProductModel, {ProductInterface} from "../models/product.js";
import mongoose from "mongoose";

await mongoose.connect('mongodb://127.0.0.1:27017/shop')

export async function getAllProducts() {
    let query = await ProductModel.findOne({}, {"_id": 0}).where('price').gt(1).exec().then((data) => data)
    return JSON.stringify(query)
}

export async function getProductById(id: number): Promise<ProductInterface> {
    return await ProductModel.find({"id": id}, {"_id": 0}).then((data) => data[0] as ProductInterface)
}