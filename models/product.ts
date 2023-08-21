import {Schema, model} from 'mongoose'

export interface ProductInterface {
    id: number,
    title: string,
    description?: string,
    price?: number,
    discountPercentage?: number,
    rating?: number,
    brand?: string,
    category?: string,
    thumbnail?: string,
    images?: string[]
}

export const productSchema = new Schema<ProductInterface>({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    discountPercentage: Number,
    rating: Number,
    brand: String,
    category: String,
    thumbnail: String,
    images: [String]
})

const ProductModel = model('product', productSchema)
export default ProductModel