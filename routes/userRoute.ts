import express from 'express'
import {getUserById} from "../services/userService.js";

export const userRouter = express.Router()

userRouter.get('/user', async (req: any, res: any) => {
    const id = req.query.id
    res.json(await getUserById(id))
})
