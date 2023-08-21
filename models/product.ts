import {Schema, model} from 'mongoose'

export interface ProductInterface {
    id: number,
    title: string,
    description?: string,
    price: number,
    discountPercentage: number,
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
    discountPercentage: {
        type: Number,
        required: true
    },
    rating: Number,
    brand: String,
    category: String,
    thumbnail: String,
    images: [String]
})

export interface CartProductInterface {
    id: number,
    title: string,
    price: number,
    quantity: number,
    total: number,
    discountPercentage: number,
    discountedPrice: number,
    thumbnail?: string
}

export const cartProductSchema = new Schema<CartProductInterface>({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    thumbnail: String
})

const ProductModel = model('product', productSchema)
export const CartProductModel = model('cart_product', cartProductSchema)
export default ProductModel