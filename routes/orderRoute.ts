import express from 'express'
import bodyParser from "body-parser";
import {addOrderController, getOrdersController, updateStatusController} from "../controllers/orderController";
const jsonParser = bodyParser.json()

export const ordersRouter = express.Router()

ordersRouter.get('/', getOrdersController)
ordersRouter.post('/update', jsonParser, updateStatusController)
ordersRouter.post('/add', jsonParser, addOrderController)