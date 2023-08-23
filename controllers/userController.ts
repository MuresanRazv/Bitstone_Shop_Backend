import UserModel, {UserInterface, UserLoginInterface} from "../models/user.js";
import {createEmptyCart} from "./cartController.js";
import {v4 as uuidv4} from 'uuid';

export async function getUserById(id: number): Promise<UserInterface> {
    return UserModel.find({"id": id}, {"_id": 0}).then((data) => data[0])
}

export async function getUserByToken(token: string): Promise<UserInterface> {
    return await UserModel.find({"token": token}, {"_id": 0}).then((data) => data[0])
}

export async function updateToken(userID: number | undefined, token: string) {
    await UserModel.findOneAndUpdate({"id": userID}, {
        "token": token
    })
}

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
    user.token = uuidv4()

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

    let token = uuidv4()

    if (userByUsername) {
        const userByPassword = await UserModel.findOne({"password": user.password})
        if (!userByPassword)
            throw new Error("Invalid password!")
        await updateToken(userByUsername.id, token).catch(e => console.log(e))
    }
    else if (userByEmail) {
        const userByPassword = await UserModel.findOne({"password": user.password})
        if (!userByPassword)
            throw new Error("Invalid password!")
        await updateToken(userByEmail.id, token).catch(e => console.log(e))
    }

    return token
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