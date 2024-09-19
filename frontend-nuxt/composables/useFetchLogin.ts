import type { UserDataResponse } from "~/assets/customTypes";

export const useFetchLogin = (username: string, password: string) => {
    return useState('fetchLogin', async (): Promise<UserDataResponse | boolean> => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(`${runtimeConfig.public.authApiBase}/login`, {
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
            return false;
        }
    });
}