import express from "express";
import bodyParser from "body-parser";
import ProductReviewModel, {ProductReviewInterface} from "../models/review.js";
import jwt from "jsonwebtoken";
import {getUserByToken} from "../controllers/userController";
export const reviewRouter = express.Router();
let jsonParser = bodyParser.json();

/**
 * Add a review for a product
 */
reviewRouter.post('/:id', jsonParser,  async (req: any, res: any) => {
    const token = req.get("Internship-Auth");
    if (!token) {
        return res.status(403).send("A token is required!");
    }
    try {
        jwt.verify(token, process.env.TOKEN_KEY!);
    }
    catch (err) {
        return res.status(401).send("Invalid Token");
    }

    const user = await getUserByToken(token);

    const userId = user.id,
        productId = req.params.id,
        username = user.username,
        {title, description, rating} = req.body;
    if(!title || !description || !rating) {
        res.status(400).send("All fields are required");
        return;
    }

    const review: ProductReviewInterface = {
        productId: productId,
        userID: userId,
        username: username,
        title: title,
        description: description,
        rating: rating
    };

    try {
        await ProductReviewModel.create(review);
        res.status(200).send("Review added successfully");
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: err});
    }
});

/**
 * Get all reviews for a product
 */
reviewRouter.get('/:id', async (req: any, res: any) => {
    const productId = req.params.id;
    try {
        const reviews = await ProductReviewModel.find({productId: productId});
        if (reviews.length === 0) {
            return;
        }
        res.status(200).json(reviews);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: err});
    }
});

reviewRouter.delete('/:id', async (req: any, res: any) => {
    const token = req.get("Internship-Auth");
    if (!token) {
        return res.status(403).send("A token is required!");
    }
    try {
        jwt.verify(token, process.env.TOKEN_KEY!);
    }
    catch (err) {
        return res.status(401).send("Invalid Token");
    }
    const reviewId = req.params.id;
    const user = await getUserByToken(token);
    const userId = user.id;

    try {
        const deletedReview = await ProductReviewModel.deleteOne({_id: reviewId, userId: userId});
        if (deletedReview.deletedCount === 0) {
            res.status(404).send("Review not found or is not yours.");
            return;
        }
        const reviews = await ProductReviewModel.find();
        res.status(200).json(reviews);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: err});
    }
});
