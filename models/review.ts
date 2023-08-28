import {Schema, model} from 'mongoose'

export interface ProductReviewInterface {
    productId: number,
    userID: number,
    title: string,
    username: string,
    description: string,
    rating: number
}

export const productReviewSchema = new Schema<ProductReviewInterface>({
    productId: {
        type: Number,
        required: true
    },
    userID: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
});

const ProductReviewModel = model('review', productReviewSchema);
export default ProductReviewModel;