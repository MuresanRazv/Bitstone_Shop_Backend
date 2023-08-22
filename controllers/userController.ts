import UserModel, {UserInterface, UserLoginInterface} from "../models/user.js";
import {createEmptyCart} from "./cartController.js";
import { v4 as uuidv4 } from 'uuid';
import user from "../models/user.js";

export async function getUserById(id: number): Promise<UserInterface> {
    return await UserModel.find({"id": id}, {"_id": 0}).then((data) => data[0])
}

export async function getUserByToken(token: string): Promise<UserInterface> {
    return await UserModel.find({"token": token}, {"_id": 0}).then((data) => data[0])
}

export async function updateToken(userID: number | undefined, token: string) {
    await UserModel.findOneAndUpdate({"id": userID}, {
        "token": token
    })
}

export async function addUser(user: any) {
    try {
        user.id = await UserModel.count() + 1
        user.token = uuidv4()
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
            const loggedUser: UserInterface | null = await UserModel.findOne({"username": user.username, "password": user.password})
            let token = uuidv4()
            await updateToken(loggedUser?.id, token)
            return token
        } catch (err) { console.log(`Error logging user ${err}`)}
    else
        try {
            const loggedUser: UserInterface | null = await UserModel.findOne({"email": user.email, "password": user.password})
            let token = uuidv4()
            await updateToken(loggedUser?.id, token)
            return token
        } catch (err) { console.log(`Error logging user ${err}`) }
    throw new Error("Invalid username, mail or password!")
}

export async function loginByToken(token: string) {
    let user = await getUserByToken(token)

    if (user)
        return user.token
    else throw new Error("Invalid token!")
}

export async function logout(token: string) {
    if (!(await getUserByToken(token)))
        throw new Error("You are not logged in!")

    await UserModel.findOneAndUpdate({"token": token}, {
        "token": ""
    })
}