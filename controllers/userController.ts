import UserModel, {UserInterface, UserLoginInterface} from "../models/user.js";
import {createEmptyCart} from "./cartController.js";

export async function getUserById(id: number): Promise<UserInterface> {
    return await UserModel.find({"id": id}, {"_id": 0}).then((data) => data[0] as UserInterface)
}

export async function addUser(user: any) {
    try {
        user.id = await UserModel.count() + 1
        let newUser = await UserModel.create(user)
        await createEmptyCart(user.id)
        return newUser
    } catch (err) {
        console.log(`Error creating user ${err}`)
    }
}

export async function loginUser(user: UserLoginInterface) {
    if (user.username)
        try {
            const loggedUser: UserInterface = await UserModel.findOne({"username": user.username, "password": user.password}) as UserInterface
            return loggedUser.id
        } catch (err) { console.log(`Error logging user ${err}`)}
    else
        try {
            const loggedUser: UserInterface = await UserModel.findOne({"email": user.email, "password": user.password}) as UserInterface
            return loggedUser.id
        } catch (err) { console.log(`Error logging user ${err}`) }
    return {}
}