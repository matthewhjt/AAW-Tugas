import { addProductToCart } from "./helper/order.js";
import { placeOrder } from "./helper/order.js";
import execution from "k6/execution";
import { Counter } from "k6/metrics";
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
    scenarios: {
        addProductToCart: {
            exec: "addProductToCartTest",
            executor: "ramping-arrival-rate",
            startRate: 1,
            timeUnit: "1s",
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                { duration: "10s", target: 5 },  // Awal sedikit request
                { duration: "20s", target: 20 }, // Meningkat
                { duration: "10s", target: 50 }, // Beban tinggi
                { duration: "20s", target: 10 }  // Menurun
            ]
        },
        placeOrder: {
            exec: "placeOrderTest",
            executor: "ramping-arrival-rate",
            startRate: 1,
            timeUnit: "1s",
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                { duration: "10s", target: 5 },  
                { duration: "20s", target: 20 }, 
                { duration: "10s", target: 50 }, 
                { duration: "20s", target: 10 }  
            ]
        }
    }
};

const addProductCounterSuccess = new Counter("add_product_counter_success");
const addProductCounterError = new Counter("add_product_counter_error");
const placeOrderCounterSuccess = new Counter("place_order_counter_success");
const placeOrderCounterError = new Counter("place_order_counter_error");

export function addProductToCartTest() {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlNzBlOGMxLTE5ZjAtNDAxMy1hNmQ1LWQ1ODEwMDhkM2E4NCIsInRlbmFudF9pZCI6ImYwNGMyY2ZmLTU3ZDktNDljNy04OGQ5LTYyMTBlMDc0ODMzNyIsImlhdCI6MTc0MTMzOTg5NSwiZXhwIjoxNzQxNDI2Mjk1fQ.WmEGnUydM5T4OtDcGOyxiJAmzGhU57h6fDFnBovwDao"; // Gantilah dengan token autentikasi yang valid
    const product = {
        "product_id": "e7806ab9-bebf-4eb3-adcf-27020881e901",
        "quantity": 1
    };

    const response = addProductToCart(token, product);
    if (response.status === 200) {
        addProductCounterSuccess.add(1);
    } else {
        addProductCounterError.add(1);
    }
}

export function placeOrderTest() {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlNzBlOGMxLTE5ZjAtNDAxMy1hNmQ1LWQ1ODEwMDhkM2E4NCIsInRlbmFudF9pZCI6ImYwNGMyY2ZmLTU3ZDktNDljNy04OGQ5LTYyMTBlMDc0ODMzNyIsImlhdCI6MTc0MTMzOTg5NSwiZXhwIjoxNzQxNDI2Mjk1fQ.WmEGnUydM5T4OtDcGOyxiJAmzGhU57h6fDFnBovwDao"; // Gantilah dengan token autentikasi yang valid
    const order = {
        "shipping_provider": "JNE"
    };

    const response = placeOrder(token, order);
    if (response.status === 200) {
        placeOrderCounterSuccess.add(1);
    } else {
        placeOrderCounterError.add(1);
    }
}
