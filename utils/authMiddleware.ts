import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
import {getUserByToken} from "../services/userServices";

/**
 *
 * @param req - request object
 * @param res - result object
 *
 * gets the token from the header and verifies it, then sends a response based on whether the token is valid or not
 *
 */
export const verifyToken = async (req: any, res: any) => {
    const token = req.get("Internship-Auth")

    if (!token) {
        return res.status(403).send("A token is required!")
    }
    try {
        jwt.verify(token, process.env.TOKEN_KEY!)

    } catch (err) {
        return res.status(401).send("Invalid Token")
    }
    return res.status(200).send(await getUserByToken(token))
}

/**
 *
 * @param fields - fields used to create a new token
 *
 * uses the fields (such as email or username) to create a new token which expires in two hours
 *
 */
export const createToken = (fields: any) => {
    return jwt.sign(
        fields,
        process.env.TOKEN_KEY as string,
        {
            expiresIn: "2h"
        }
    )
}