import {Schema, model} from "mongoose";
import {CartProductInterface, cartProductSchema} from "./product.js";

export interface CartInterface {
    id: number,
    products: CartProductInterface[],
    total?: number,
    discountedTotal?: number,
    userId: number,
    totalProducts?: number,
    totalQuantity?: number
}

export const cartSchema = new Schema<CartInterface>({
    id: {
        type: Number,
        required: true
    },
    products: {
        type: [cartProductSchema],
        required: true
    },
    total: Number,
    userId: {
        type: Number,
        required: true
    },
    totalProducts: Number,
    totalQuantity: Number,
    discountedTotal: Number
})

const CartModel = model('cart', cartSchema)
export default CartModel