import UserModel, {UserInterface} from "../models/user.js";
import mongoose from "mongoose";
import {createEmptyCart} from "./cartService.js";

await mongoose.connect('mongodb://127.0.0.1:27017/shop')

export async function getUserById(id: number): Promise<UserInterface> {
    return await UserModel.find({"id": id}, {"_id": 0}).then((data) => data[0] as UserInterface)
}

export async function addUser(user: UserInterface) {
    try {
        await UserModel.create(user)
        await createEmptyCart(user.id)
    } catch (err) {
        console.log(`Error creating user ${err}`)
    }
}