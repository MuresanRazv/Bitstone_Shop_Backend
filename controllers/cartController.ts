import {getCartByToken, updateCart} from "../services/cartServices";

/**
 * get the token from the header and return the cart of a user which has this token
 */
export async function getCart(req: any, res: any) {
    const token = req.get('Internship-Auth')
    getCartByToken(token).then(data => res.json(data))
}

/**
 * get the token from the header and the products from the body and update the cart
 */
export async function updateCartController(req: any, res: any) {
    updateCart(req.get("Internship-Auth"), req.body.products).then(data => res.json(data))
}