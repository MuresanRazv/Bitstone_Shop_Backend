import ReturnModel, {ReturnInterface} from "../models/return";
import {getUserByToken} from "./userServices";
import OrderModel, {OrderInterface} from "../models/order";
import {CartProductInterface} from "../models/product";
import {getProductById} from "./productServices";

export async function getReturns(token: string) {
    const user = await getUserByToken(token)
    return ReturnModel.find({"userID": user.id})
}

export async function addReturn(returnInformation: any) {
    const order = await OrderModel.findById(returnInformation.orderID)

    // check if searched order exists
    if (!order)
        throw new Error("Invalid order!")

    // function which returns a product if it exists in the products of return information
    const getProductById = (id: number, returnObj: ReturnInterface) => {
        for (let product of returnObj.products) {
            if (product.id === id)
                return product
        }
    }

    const newProducts: CartProductInterface[] = []
    let newOrderTotal = 0
    for (let product of order.products) {
        let currentProduct = getProductById(product.id, returnInformation)

        // product that we want to return exists and there will still be some products of that type remaining in the
        // order after returning it
        if (currentProduct !== undefined && currentProduct?.quantity + product.quantity > 0) {
            let newTotal = (currentProduct.quantity + product.quantity) * currentProduct.price
            newProducts.push({
                id: product.id,
                title: product.title,
                price: product.price,
                quantity: currentProduct.quantity + product.quantity,
                total: newTotal,
                discountPercentage: product.discountPercentage,
                discountedPrice: newTotal - (newTotal * product.discountPercentage) / 100,
                thumbnail: currentProduct.thumbnail
            })

            newOrderTotal += newTotal - (newTotal * currentProduct.discountPercentage) / 100
        // the product we want to return exists in the order, we return all the products of that type from the order
        } else if (currentProduct !== undefined && currentProduct?.quantity + product.quantity > 0) {
            newProducts.push(product)
            newOrderTotal += product.discountedPrice
        // the product we want to return does not exist in the products of our order
        } else if (currentProduct === undefined) {
            newProducts.push(product)
            newOrderTotal += product.discountedPrice
        }
    }

    order!.products = newProducts
    order!.discountedTotal = newOrderTotal

    // get information about the products we are returning
    const returnProducts: CartProductInterface[] = []
    for (let product of order!.products) {
        let currentProduct = getProductById(product.id, returnInformation)
        if (currentProduct !== undefined) {
            let returnProduct = product
            returnProduct.quantity = currentProduct.quantity
            returnProducts.push(returnProduct)
        }
    }

    // add new status to our order
    order!.status.push({
        date: new Date().toISOString(),
        status: `Returned following products: ${JSON.stringify(returnProducts)}`
    })
    await order!.save()

    return await ReturnModel.create({
        userID: returnInformation.userID,
        orderID: returnInformation.orderID,
        products: returnProducts
    })
}