// src/utils/token.js
import { jwtDecode } from 'jwt-decode';

export function token(logoutCallback) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const decoded = jwtDecode(token);

        const expiry = decoded.exp * 1000;
        const now = Date.now();
        const timeLeft = expiry - now;


        if (timeLeft <= 0) {
            logoutCallback();
        } else {
            setTimeout(() => {
                logoutCallback();
            }, timeLeft);
        }
    } catch (err) {
        console.error('Invalid token:', err);
        logoutCallback();
    }
}
