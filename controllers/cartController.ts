import CartModel, {CartInterface} from "../models/cart.js";
import {CartProductInterface} from "../models/product.js";
import {getProductById} from "./productController.js";
import {getUserByToken} from "./userController.js";

export async function getCartById(id: number): Promise<CartInterface> {
    return await CartModel.find({"userId": id}, {"_id": 0}).then((data) => data[0])
}

export async function getCartByToken(token: string): Promise<CartInterface> {
    let user = await getUserByToken(token)
    return await getCartById(user?.id).then(data => data)
}

export async function createEmptyCart(userID: number) {
    let newCart: CartInterface = {
        id: await CartModel.count() + 1,
        products: [],
        total: 0,
        discountedTotal: 0,
        totalProducts: 0,
        totalQuantity: 0,
        userId: userID
    }
    CartModel.create(newCart).then()
}

export async function emptyCart(userID: number) {
    CartModel.findOneAndUpdate({"userID": userID}, {
        products: [],
        total: 0,
        discountedTotal: 0,
        totalProducts: 0,
        totalQuantity: 0,
    })
}

function getProduct(productID: number, products: CartProductInterface[]): {} | CartProductInterface {
    for (let product of products) {
        if (product.id === productID)
            return product
    }
    return {}
}

export async function updateCart(token: string, products: CartProductInterface[]) {
    try {
        let cart = await getCartByToken(token)

        // update products quantity
        for (let product of products) {
            let productFromCart = getProduct(product.id, cart.products)
            if ("quantity" in productFromCart) {
                productFromCart.quantity += product.quantity
                productFromCart.total = productFromCart.price * productFromCart.quantity
            }
            else if (product.quantity > 0) {
                let currentProduct = await getProductById(product.id)
                let newProduct: CartProductInterface = {
                    id: currentProduct.id,
                    quantity: 1,
                    price: currentProduct.price,
                    total: currentProduct.price,
                    title: currentProduct.title,
                    thumbnail: currentProduct.thumbnail,
                    discountPercentage: currentProduct.discountPercentage,
                    discountedPrice: currentProduct.price - currentProduct.price * currentProduct.discountPercentage / 100
                }
                cart.products.push(newProduct)
            }
        }

        // filter any products that have <= 0 quantity
        cart.products = cart.products.filter((product) => product.quantity > 0)

        cart.totalProducts = cart.products.length
        cart.totalQuantity = cart.products.reduce((a, b) => a + b.quantity, 0)
        cart.total = cart.products.reduce((a, b) => a + b.total, 0)
        cart.discountedTotal = cart.products.reduce((a, b) => a + b.total - b.total * b.discountPercentage / 100, 0)

        // update the cart in db
        return CartModel.findOneAndUpdate({id: cart.id},
            {
                products: cart.products,
                totalProducts: cart.totalProducts,
                totalQuantity: cart.totalQuantity,
                total: cart.total,
                discountedTotal: cart.discountedTotal
            }, {new: true});
    } catch (err) {
        console.log(`Error updating cart ${err}`)
    }
    return {}
}