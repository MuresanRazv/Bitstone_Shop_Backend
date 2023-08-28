import express from 'express'
import {getCartById, getCartByToken, updateCart} from "../services/cartServices";
import bodyParser from 'body-parser'
import {getCart, updateCartController} from "../controllers/cartController";

export const cartRouter = express.Router()
const jsonParser = bodyParser.json()

cartRouter.get('/', getCart)
cartRouter.post('/', jsonParser, updateCartController)