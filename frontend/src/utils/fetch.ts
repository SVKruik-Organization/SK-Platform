import type { UserDataResponse } from "@/assets/customTypes";

/**
 * Temp
 * @returns Data or false on error.
 */
export async function fetchTemp(): Promise<boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE}`);
        if (response.ok) {
            return true;
        } else return false;
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