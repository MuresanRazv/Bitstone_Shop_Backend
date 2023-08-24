import {CartProductInterface, cartProductSchema} from "./product.js";
import {model, Schema} from "mongoose";
import {cartSchema} from "./cart.js";

export interface StatusInterface {
    date: string,
    status: string
}

export const statusSchema = new Schema<StatusInterface>({
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})

export interface OrderInterface {
    userID: number
    products: CartProductInterface[],
    discountedTotal: number,
    date: string,
    zip: string,
    street: string,
    county: string,
    city: string,
    status: StatusInterface[],
    id: number
}

export const orderSchema = new Schema<OrderInterface>({
    userID: {
        type: Number,
        required: true
    },
    products: {
        type: [cartProductSchema],
        required: true
    },
    discountedTotal: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    county: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    status: {
        type: [statusSchema],
        required: true
    },
    id: {
        type: Number,
        required: true
    }
})

const OrderModel = model('order', orderSchema)
export default OrderModel