import UserModel, {UserInterface, UserLoginInterface} from "../models/user.js";
import {createEmptyCart} from "./cartController.js";
import bcrypt from 'bcryptjs'
import {config} from "dotenv";
import {createToken} from "../utils/authMiddleware.js";
import OrderModel from "../models/order.js";

export async function getUserByToken(token: string): Promise<UserInterface> {
    return await UserModel.find({"token": token}, {"_id": 0}).then((data) => data[0])
}

export async function updateToken(userID: number | undefined, token: string) {
    await UserModel.findOneAndUpdate({"id": userID}, {
        "token": token
    })
}

export async function addUser(user: UserInterface) {
    config()
    let userByUsername = await UserModel.findOne({"username": user.username}),
        userByEmail = await UserModel.findOne({"email": user.email})

    if (userByUsername) {
        throw new Error("Username already exists!")
    }
    else if (userByEmail) {
        throw new Error("Email already exists!")
    }

    user.id = await UserModel.count() + 1
    user.password = await bcrypt.hash(user.password, 10);
    user.token = createToken({ user_id: user.id, email: user.email })

    try {
        let newUser = UserModel.create(user)
        createEmptyCart(user.id).then()
        return user.token
    } catch (err: any) {
        throw err
    }
}

export async function loginUser(user: UserLoginInterface) {
    const userByUsername: UserInterface | null = await UserModel.findOne({"username": user.username})
    const userByEmail: UserInterface | null = await UserModel.findOne({"email": user.email})

    if (!userByEmail && !userByUsername) {
        throw new Error("Invalid email or username!")
    }

    if (userByUsername) {
        if (!await bcrypt.compare(user.password, userByUsername.password))
            throw new Error("Invalid password!")
        let token = createToken({ user_id: userByUsername.id, email: userByUsername.email})
        await updateToken(userByUsername.id, token).catch(e => console.log(e))
        return token
    }
    else if (userByEmail) {
        if (!await bcrypt.compare(user.password, userByEmail.password))
            throw new Error("Invalid password!")
        let token = createToken({ user_id: userByEmail.id, email: userByEmail.email})
        await updateToken(userByEmail.id, token).catch(e => console.log(e))
        return token
    }
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

export async function getOrders(token: string) {
    let user = await getUserByToken(token)
    if (!(user))
        throw new Error("Invalid user token!")

    const order = await OrderModel.find({"userID": user.id}, {"_id": 0})

    if (!order)
        throw new Error("No orders for this user!")
    else return order
}