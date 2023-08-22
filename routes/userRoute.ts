import express from 'express'
import {addUser, getUserById, loginByToken, loginUser, logout} from "../controllers/userController.js";
import bodyParser from "body-parser";
import {UserLoginInterface} from "../models/user.js";

export const userRouter = express.Router()

let jsonParser = bodyParser.json()

userRouter.get('/', async (req: any, res: any) => {
    const id = req.query.id
    res.json(await getUserById(id))
})

userRouter.post('/register', jsonParser, async (req: any, res: any) => {
    res.json(await addUser(req.body))
})

userRouter.post('/login', jsonParser, async (req: any, res: any) => {
    let user: UserLoginInterface = req.body
    let token: string = req.get("Internship-Auth")
    try {
        let login: string | undefined
        login = token ? await loginByToken(token): await loginUser(user)
        res.json(login)
    }
    catch (err: any) {
        res.status(404).send(err.message)
    }
})

userRouter.post('/logout', jsonParser, async (req: any, res: any) => {
    let token: string = req.get("Internship-Auth")
    try {
        await logout(token)
        res.status(200).send("Logout successful")
    }
    catch (err: any) {
        res.status(404).send(err.message)
    }
})