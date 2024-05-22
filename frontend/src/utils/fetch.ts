import type { UserDataResponse } from "@/assets/customTypes";

/**
 * Validates user session.
 * @returns True if still valid, false if not.
 */
export async function fetchBase(token: string): Promise<boolean> {
    try {
        const response = await fetch(import.meta.env.VITE_API_BASE, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.ok;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Fetch a JWT token if credentials are correct.
 * @returns Data or false on error.
 */
export async function fetchLogin(username: string, password: string): Promise<UserDataResponse | boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        });
        if (response.ok) {
            return await response.json();
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}