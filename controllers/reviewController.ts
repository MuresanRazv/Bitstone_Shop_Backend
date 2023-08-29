import jwt from "jsonwebtoken";
import {getOrders, getUserByToken} from "../services/userServices";
import ProductReviewModel, {ProductReviewInterface} from "../models/review";
import {getCartByToken} from "../services/cartServices";

/**
 * Add a review for a product
 */
export async function addReviewController(req: any, res: any) {
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
    const orders = await getOrders(token)

    const userId = user.id,
        productId = req.params.id,
        username = user.username,
        {title, description, rating} = req.body;

    let ordered = false
    for (let order of orders) {
        (order.products.map((product) => { if (product.id === Number(productId)) ordered = true }))
    }

    if (!ordered) {
        return res.status(400).send({"message": "You can leave a review if you bought the product!"})
    }

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
        res.status(200).send({"message": "Review added successfully"});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({"message": err});
    }
}

/**
 * Get all reviews for a product
 */
export async function getReviewsController(req: any, res: any) {
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
}

/**
 * Delete review of a product
 */
export async function deleteReviewController(req: any, res: any) {
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
    try {
        const deletedReview = await ProductReviewModel.findByIdAndDelete(reviewId);
        if (!deletedReview) {
            return;
        }
        const reviews = await ProductReviewModel.find();
        res.status(200).json(reviews);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: err});
    }
}