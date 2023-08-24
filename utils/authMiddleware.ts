import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
import {getUserByToken} from "../controllers/userController.js";

export const verifyToken = async (req: any, res: any) => {
    config()
    const token = req.get("Internship-Auth")

    if (!token) {
        return res.status(403).send("A token is required!")
    }
    try {
        jwt.verify(token, process.env.TOKEN_KEY as string)

    } catch (err) {
        return res.status(401).send("Invalid Token")
    }
    return res.status(200).send(await getUserByToken(token))
}

export const createToken = (fields: any) => {
    return jwt.sign(
        fields,
        process.env.TOKEN_KEY as string,
        {
            expiresIn: "2h"
        }
    )
}