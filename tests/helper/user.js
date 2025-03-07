import http from "k6/http";
import {check} from "k6";

export function loginUser(body) {
    const loginResponse = http.post('http://localhost:8000/api/auth/login', JSON.stringify(body), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    check(loginResponse, {
        'login response status must 200': (response) => response.status === 200,
        'login response token must exists': (response) => response.json().data.token != null,
    });
    return loginResponse;
}