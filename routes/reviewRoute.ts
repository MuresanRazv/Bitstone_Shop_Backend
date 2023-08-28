import express from "express";
import bodyParser from "body-parser";
import {addReviewController, deleteReviewController, getReviewsController} from "../controllers/reviewController";
export const reviewRouter = express.Router();
let jsonParser = bodyParser.json();

reviewRouter.post('/:id', jsonParser, addReviewController)
reviewRouter.get('/:id', getReviewsController)
reviewRouter.delete('/:id', deleteReviewController)
