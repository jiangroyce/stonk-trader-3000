import { useSelector, useDispatch } from "react-redux";
import "./OrderHistory.css"
import { useEffect, useState } from "react";
import { fetchOrders } from "../../redux/order";

export default function OrderHistory() {
    const [isLoaded, setIsLoaded] = useState(false)
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders.orders);

    useEffect(() => {
        dispatch(fetchOrders()).then(setIsLoaded(true))
    }, [dispatch, setIsLoaded])

    if (!isLoaded) return <h1>Loading</h1>
    else return (
        <>
        <h1>Order History</h1>
        <table>
            <thead>
                <tr>
                    <th scope="col">Order Number</th>
                    <th scope="col">Order Date</th>
                    <th scope="col">Ticker</th>
                    <th scope="col">Cost Basis</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total Cost</th>
                </tr>
            </thead>
            <tbody>
            {orders?.map((order, index) => (
            <tr key={index}>
                <th scope="row">{order.order_number}</th>
                <td>{order.placed_on}</td>
                <td>{order.stock_ticker}</td>
                <td>{order.cost_basis}</td>
                <td>{order.quantity}</td>
                <td>{order.cost_basis * order.quantity}</td>
            </tr>
            ))}
            </tbody>
        </table>
        </>

    )
}
