import type { UserData } from "@/assets/customTypes";
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
    state: () => {
        return {
            user: {} as UserData
        }
    },
    actions: {
        setUser(userData: UserData): void {
            this.user = userData;
        },
        signOut(): void {
            this.setUser({} as UserData);
            useRouter().push("/");
        }
    }
});