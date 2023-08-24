import express from 'express'
import {addUser, getUserById, getUserByToken, loginByToken, loginUser, logout} from "../controllers/userController.js";
import bodyParser from "body-parser";
import {UserLoginInterface} from "../models/user.js";
import {verifyToken} from "../utils/authMiddleware.js";

export const userRouter = express.Router()

let jsonParser = bodyParser.json()

userRouter.get('/', verifyToken, (req, res) => {
    res.status(200).send("Authentication Success")
})

userRouter.post('/register', jsonParser, async (req: any, res: any) => {
    try {
        res.json(await addUser(req.body).then(data => data))
    } catch (err: any) {
        res.json({ "message": err.message })
    }
})

userRouter.post('/login', jsonParser, async (req: any, res: any) => {
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
})

userRouter.post('/logout', jsonParser, async (req: any, res: any) => {
    let token: string = req.get("Internship-Auth")
    try {
        logout(token).catch(e => console.log(e))
        res.status(200).send("Logout successful")
    }
    catch (err: any) {
        res.status(404).send({"message": err.message})
    }
})