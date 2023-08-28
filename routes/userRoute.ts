import express from 'express'
import {addUser, loginByToken, loginUser, logout} from "../services/userServices";
import bodyParser from "body-parser";
import {UserLoginInterface} from "../models/user.js";
import {verifyToken} from "../utils/authMiddleware.js";
import {config} from "dotenv";
import {addUserController, loginUserController, logoutUserController} from "../controllers/userController";

export const userRouter = express.Router()

let jsonParser = bodyParser.json()

/**
 * get the token from the header and verify it
 */
userRouter.get('/', verifyToken, (req, res) => {
    res.status(200).send("Authentication Success")
})

userRouter.post('/register', jsonParser, addUserController)
userRouter.post('/login', jsonParser, loginUserController)
userRouter.post('/logout', jsonParser, logoutUserController)