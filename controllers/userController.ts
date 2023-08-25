import UserModel, {UserInterface, UserLoginInterface} from "../models/user.js";
import {createEmptyCart} from "./cartController.js";
import bcrypt from 'bcryptjs'
import {config} from "dotenv";
import {createToken} from "../utils/authMiddleware.js";
import OrderModel from "../models/order.js";

/**
 *
 * @param token - token of a logged user
 *
 * makes a database query and retrieves a user based on its token
 *
 */
export async function getUserByToken(token: string): Promise<UserInterface> {
    return await UserModel.find({"token": token}, {"_id": 0}).then((data) => data[0])
}

/**
 *
 * @param userID - id of a user
 * @param token - token of a logged user
 *
 * updates the token of a user
 *
 */
export async function updateToken(userID: number | undefined, token: string) {
    await UserModel.findOneAndUpdate({"id": userID}, {
        "token": token
    })
}

/**
 *
 * @param user - a user object
 *
 * verifies if the user exists already and if not it add it to the database
 *
 */
export async function addUser(user: UserInterface) {
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

/**
 *
 * @param user - a user object
 *
 * checks if the user/email and password match and then returns a new token with a lifetime of 2 hours
 *
 */

export async function loginUser(user: UserLoginInterface) {
    const userByUsername: UserInterface | null = await UserModel.findOne({"username": user.username}),
        userByEmail: UserInterface | null = await UserModel.findOne({"email": user.email})

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

/**
 *
 * @param token - token of a user
 *
 * checks if there exists a user with the token given as parameter and if it matches, returns the user
 *
 */
export async function loginByToken(token: string) {
    let user = await getUserByToken(token)

    if (user)
        return user.token
    else throw new Error("Invalid token!")
}

/**
 *
 * @param token - token of a logged user
 *
 * checks if there is a user logged in with that token and if so, it deletes its token from the database
 *
 */
export async function logout(token: string) {
    if (!(await getUserByToken(token)))
        throw new Error("You are not logged in!")

    await UserModel.findOneAndUpdate({"token": token}, {
        "token": ""
    })
}

/**
 *
 * @param token - token of a logged user
 *
 * checks if there is a logged user with that token and then returns the user's orders
 *
 */
export async function getOrders(token: string) {
    let user = await getUserByToken(token)
    if (!(user))
        throw new Error("Invalid user token!")

    const order = await OrderModel.find({"userID": user.id}, {"_id": 0})

    if (!order)
        throw new Error("No orders for this user!")
    else return order
}