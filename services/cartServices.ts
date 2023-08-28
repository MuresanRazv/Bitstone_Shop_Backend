import CartModel, {CartInterface} from "../models/cart.js";
import {CartProductInterface} from "../models/product.js";
import {getProductById} from "./productServices";
import {getUserByToken} from "./userServices";


/**
 *
 * @param id - represents id of a user
 *
 * makes a database query by the given id
 *
 */
export async function getCartById(id: number): Promise<CartInterface> {
    return await CartModel.find({"userId": id}, {"_id": 0}).then((data) => data[0])
}

/**
 *
 * @param token - represents the token of logged user
 *
 * makes a two database queries, one for getting the user by its token and then using that id to get the cart
 *
 */
export async function getCartByToken(token: string): Promise<CartInterface> {
    let user = await getUserByToken(token)
    return await getCartById(user?.id).then(data => data)
}

/**
 *
 * @param userID - represents the id of a user
 *
 * creates a new CartInterface object and assigns userID as its id
 *
 */
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

/**
 *
 * @param userID - id of a user
 *
 * makes a query that gets the cart by userID and empties it
 *
 */
export async function emptyCart(userID: number) {
    await CartModel.findOneAndUpdate({"userId": userID}, {
        products: [],
        total: 0,
        discountedTotal: 0,
        totalProducts: 0,
        totalQuantity: 0,
    })
}

/**
 *
 * @param productID - id of a product
 * @param products - an array of products
 *
 * retrieves a product from the array of products by id
 *
 */
function getProduct(productID: number, products: CartProductInterface[]): {} | CartProductInterface {
    for (let product of products) {
        if (product.id === productID)
            return product
    }
    return {}
}

/**
 *
 * @param token - token of a logged user
 * @param products - an array of products
 *
 * a function that receives an array of cart products and their quantities and updates the cart of a user based
 * on their token
 *
 */
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