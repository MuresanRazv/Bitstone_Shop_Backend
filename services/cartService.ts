import CartModel, {CartInterface} from "../models/cart.js";
import mongoose from "mongoose";
import {CartProductInterface} from "../models/product.js";

await mongoose.connect('mongodb://127.0.0.1:27017/shop')

export async function getCartById(id: number): Promise<CartInterface> {
    return await CartModel.find({"id": id}, {"_id": 0}).then((data) => data[0] as CartInterface)
}

export async function createEmptyCart(userID: number) {
    let newCart: CartInterface = {
        id: await CartModel.count() + 1,
        products: [],
        total: 0,
        discountedTotal: 0,
        totalProducts: 0,
        totalQuantity: 0,
        userID: userID
    }
    await CartModel.create(newCart)
}

export async function getQuantityOfProduct(cardID: number, productID: number) {
    let cart = await getCartById(cardID)
    return cart.products.filter(product => product.id === productID).length
}

function getProduct(productID: number, products: CartProductInterface[]): {} | CartProductInterface {
    for (let product of products) {
        if (product.id === productID)
            return product
    }
    return {}
}

export async function updateCart(cartID: number, products: CartProductInterface[]) {
    try {
        let cart = await getCartById(cartID)

        // update products quantity
        for (let product of products) {
            let productFromCart = getProduct(product.id, cart.products)
            if ("quantity" in productFromCart) {
                productFromCart.quantity += product.quantity
                productFromCart.total = productFromCart.price * productFromCart.quantity
            }
        }

        // filter any products that have <= 0 quantity
        cart.products = cart.products.filter((product) => product.quantity > 0)

        // update the cart in db
        return await CartModel.findOneAndUpdate({ id: cartID }, { products: cart.products }, { new: true })
    } catch (err) {
        console.log(`Error updating cart ${err}`)
    }
    return {}
}