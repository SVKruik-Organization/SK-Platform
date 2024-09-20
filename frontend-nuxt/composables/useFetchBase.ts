export const useFetchBase = async (token: string) => {
    const fetchBase = ref<boolean>(false);
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(runtimeConfig.public.authApiBase, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                fetchBase.value = response.ok;
            } catch (error) {
                fetchBase.value = false;
            }
            resolve();
        });
    });

    return fetchBase
}