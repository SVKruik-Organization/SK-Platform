import { ImageErrorTypes } from "~/assets/customTypes";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide('handleFallbackImage', (event: ErrorEvent, type: ImageErrorTypes): void => {
        const eventTarget = event.target as HTMLImageElement;
        if (eventTarget && eventTarget.tagName === "IMG") {
            switch (type) {
                case ImageErrorTypes.icon:
                    eventTarget.src = "/img/svg/circle-exclamation-regular.svg";
                    break;
                case ImageErrorTypes.banner:
                    eventTarget.src = "/img/svg/image-landscape-regular.svg";
                    break;
            }
            eventTarget.classList.add("error-image");
        }
    });
});