import http from "k6/http";
import { check } from "k6";

export function addProductToCart(token, product) {
    const response = http.post('http://localhost:8001/api/cart', JSON.stringify(product), {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    check(response, {
        'add product to cart status is 200': (response) => response.status === 200
    });

    return response;
}

export function placeOrder(token, order) {
    const response = http.post('http://localhost:8001/api/order', JSON.stringify(order), {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    check(response, {
        'place order status is 200': (response) => response.status === 200
    });

    return response;
}
