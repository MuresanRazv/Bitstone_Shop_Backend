import express from 'express'
import {getProductById, getProducts} from "../services/productServices";
import {getProductsController} from "../controllers/productController";

export const productsRouter = express.Router()

productsRouter.get('/product', getProductsController)