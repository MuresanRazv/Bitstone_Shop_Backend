import {CartProductInterface, cartProductSchema} from "./product";
import {model, Schema} from "mongoose";

export interface ReturnInterface {
    date?: Date,
    products: CartProductInterface[],
    userID: number,
    orderID: string
}

export const returnSchema = new Schema<ReturnInterface>({
    date: {
        type: Date,
        default: Date.now
    },
    products: {
        type: [cartProductSchema],
        required: true
    },
    userID: {
        type: Number,
        required: true
    },
    orderID: {
        type: String,
        required: true
    }
})

const ReturnModel = model('return', returnSchema)
export default ReturnModel