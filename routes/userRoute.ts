import express from 'express'
import {addUser, getUserById, loginUser} from "../controllers/userController.js";
import bodyParser from "body-parser";
import {UserLoginInterface} from "../models/user.js";

export const userRouter = express.Router()

let jsonParser = bodyParser.json()

userRouter.get('/', async (req: any, res: any) => {
    const id = req.query.id
    res.json(await getUserById(id))
})

userRouter.post('/', jsonParser, async (req: any, res: any) => {
    res.json(await addUser(req.body))
})

userRouter.post('/login', jsonParser, async (req: any, res: any) => {
    let user: UserLoginInterface = req.body
    let login = await loginUser(user)
    res.json(login)
})
