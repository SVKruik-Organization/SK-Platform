export const useFetchBase = (token: string) => {
    return useState('fetchBase', async (): Promise<boolean> => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(runtimeConfig.public.authApiBase, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    });
}