import express from "express";
import bodyParser from "body-parser";
import {addReturnController, getReturnsController} from "../controllers/returnController.js";

export const returnRouter = express.Router()
const jsonParser = bodyParser.json()

returnRouter.get('/', getReturnsController)
returnRouter.post('/', jsonParser, addReturnController)