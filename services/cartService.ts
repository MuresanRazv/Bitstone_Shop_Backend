import CartModel, {CartInterface} from "../models/cart.js";
import mongoose from "mongoose";

await mongoose.connect('mongodb://127.0.0.1:27017/shop')

export async function getCartById(id: number): Promise<CartInterface> {
    return await CartModel.find({"id": id}, {"_id": 0}).then((data) => data[0] as CartInterface)
}