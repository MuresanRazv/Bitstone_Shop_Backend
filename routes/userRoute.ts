import express from 'express'
import {addUser, getUserById} from "../services/userService.js";
import bodyParser from "body-parser";

export const userRouter = express.Router()

let jsonParser = bodyParser.json()

userRouter.get('/user', async (req: any, res: any) => {
    const id = req.query.id
    res.json(await getUserById(id))
})

userRouter.post('/user', jsonParser, async (req: any, res: any) => {
    res.json(await addUser(req.body))
})
