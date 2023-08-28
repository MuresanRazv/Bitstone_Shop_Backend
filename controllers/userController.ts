import {addUser, loginByToken, loginUser, logout} from "../services/userServices";
import {UserLoginInterface} from "../models/user";

/**
 * get user information from body and then register the user
 */
export async function addUserController(req: any, res: any) {
    try {
        addUser(req.body).then(data => res.json(data))
    } catch (err: any) {
        res.json({ "message": err.message })
    }
}

/**
 * get login information from body and then login the user, returns a new token associated with the user
 */
export async function loginUserController(req: any, res: any) {
    let user: UserLoginInterface = req.body
    let token: string = req.get("Internship-Auth")
    try {
        let login: string | undefined
        if (token) {
            login = await loginByToken(token).then(data => data)
        } else {
            login = await loginUser(user).then(data => data)
        }
        res.json(login)
    }
    catch (err: any) {
        res.status(404).send({"message": err.message})
    }
}

/**
 * get the token associated with the logged user and then logout that user
 */
export async function logoutUserController(req: any, res: any) {
    let token: string = req.get("Internship-Auth")
    try {
        logout(token).catch(e => console.log(e))
        res.status(200).send("Logout successful")
    }
    catch (err: any) {
        res.status(404).send({"message": err.message})
    }
}