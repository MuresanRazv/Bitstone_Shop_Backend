import express from 'express'
import {getProductsController} from "../controllers/productController";

export const productsRouter = express.Router()

productsRouter.get('/product', getProductsController)