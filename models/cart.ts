import {Schema, model} from "mongoose";
import ProductModel, {ProductInterface, productSchema} from "./product.js";

export interface CartInterface {
    id: number,
    products: ProductInterface[],
    total?: number,
    discountedTotal?: number,
    userID: number,
    totalProducts?: number,
    totalQuantity?: number
}

export const cartSchema = new Schema<CartInterface>({
    id: {
        type: Number,
        required: true
    },
    products: {
        type: [productSchema],
        required: true
    },
    total: Number,
    userID: {
        type: Number,
        required: true
    },
    totalProducts: Number,
    totalQuantity: Number
})

const CartModel = model('cart', cartSchema)
export default CartModel