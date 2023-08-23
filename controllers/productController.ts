import ProductModel, {ProductInterface} from "../models/product.js";

export async function getAllProducts() {
    return ProductModel.findOne({}, {"_id": 0}).where('price').gt(1).exec().then((data) => JSON.stringify(data))
}

export async function getProductById(id: number): Promise<ProductInterface> {
    return ProductModel.find({"id": id}, {"_id": 0}).then((data) => data[0])
}

export async function getByCategory(category: string): Promise<ProductInterface[]> {
    return ProductModel.find({"category": category}, {"_id": 0})
}

export async function getProducts(skip: number = 0, limit: number = 0, categories: string[] = []): Promise<ProductInterface[]> {
    let mongoose_categories = categories.map(category => ({category: category}))
    return ProductModel.find({ $or: mongoose_categories}).skip(skip).limit(limit)
}