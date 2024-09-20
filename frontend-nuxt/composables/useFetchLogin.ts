import type { UserDataResponse } from "~/assets/customTypes";

export const useFetchLogin = async (username: string, password: string) => {
    const login = ref<UserDataResponse | boolean>(false);
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
                if (response.ok) {
                    login.value = await response.json();
                } else login.value = false;
            } catch (error) {
                login.value = false;
            }
            resolve();
        });
    });

    return login;
}