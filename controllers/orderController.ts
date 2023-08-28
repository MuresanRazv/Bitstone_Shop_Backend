import OrderModel, {OrderInterface, StatusInterface} from "../models/order.js";

/**
 *
 * @param id - id of an order
 * @param userID - id of a user
 *
 * makes a database query that gets an order by its id and the user of the id which makes sure that no user can modify
 * the order of another user
 *
 */
export async function getOrderById(id: number, userID: number): Promise<OrderInterface> {
    const order = await OrderModel.find({"id": id, "userID": userID}, {"_id": 0}).then(data => data[0])
    if (!!order) {
        return order
    } else {
        throw new Error("Order does not exist/user id and order id do not match")
    }
}

/**
 *
 * @param id - id of an order
 * @param userID - id of a user
 * @param status - new status message
 *
 * gets the order of a user by the user's id and the order's id and updates its status
 *
 */
export async function updateStatus(id: number, userID: number, status: string) {
    let newStatus: StatusInterface = {
        status: status,
        date: new Date().toISOString()
    }

    let order = await getOrderById(id, userID)
    if (!order) {
        throw new Error("Order does not exist/user id and order id do not match")
    }

    order.status.push(newStatus)
    await OrderModel.findOneAndUpdate({"id": id, "userID": userID}, {
         "status": order.status
    })
}

/**
 *
 * @param order - an order
 *
 * adds the order to the database
 *
 */
export async function addOrder(order: OrderInterface) {
    if (order.products.length === 0)
        throw new Error("Warning! The cart is empty.")

    let newOrder = await OrderModel.create(order)
    return newOrder.id
}