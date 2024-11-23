import type { UserDataResponse } from "~/assets/customTypes";

export const useFetchLogin = async (username: string, password: string): Promise<string | UserDataResponse> => {
    const login = ref<string | UserDataResponse>("Error");
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
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
                if (response.ok) login.value = await response.json();
            } catch (error: any) {
                login.value = "Something went wrong while logging in. Please try again later.";
            }
            resolve();
        });
    });

    return login.value;
}