<script setup lang="ts">
import { type ToastItem } from "@/assets/customTypes";

// Setup
const { $listen } = useNuxtApp();

// Reactive Data
const toastItems: Ref<Array<ToastItem>> = ref([]);

$listen("emit-toast", (event: any) => {
    const toastEvent = event as ToastItem;
    console.log(toastEvent);
    toastItems.value.push(toastEvent);

    setTimeout(() => {
        const toastItem = document.getElementById(`toast-item-${toastEvent.id}`) as HTMLDivElement;
        toastItem.classList.add("toast-open");
    }, 100);

    setTimeout(() => {
        closeMessage(toastEvent.id);
    }, toastEvent.duration * 1000);
});

// Methods

/**
 * Close the toast message the user clicked on.
 * @param id The id of the toast to close.
 */
function closeMessage(id: string | MouseEvent): void {
    let toastItem: HTMLDivElement;
    if (typeof id === "object") {
        toastItem = (id.target as HTMLElement).parentElement as HTMLDivElement;
    } else {
        const toastItemFetch = document.getElementById(`toast-item-${id}`) as HTMLDivElement | null;
        if (!toastItemFetch) return;
        toastItem = toastItemFetch;
    }

    toastItem.classList.remove("toast-open");
    const toastId = typeof id === "object" ? toastItem.id.split("-")[2] : id;
    setTimeout(() => {
        toastItems.value = toastItems.value.filter((item) => item.id !== toastId);
    }, 500);
}
</script>

<template>
    <div class="flex-col toast-container">
        <div v-for="item in toastItems" :id="`toast-item-${item.id}`" class="flex toast-item glass" :key="item.id">
            <span :class="`toast-color-indicator toast-color-${item.type}`"></span>
            <div class="flex toast-item-content">
                <p>{{ item.message }}</p>
                <NuxtImg class="icon" width="15" height="15" src="/svg/xmark-regular.svg" loading="lazy" alt="Icon" />
            </div>
            <span class="click-item" @click="closeMessage($event)"></span>
        </div>
    </div>
</template>

<style scoped>
.toast-container {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 6;
    width: 90%;
    max-width: 600px;
    gap: 10px;
}

.toast-item {
    width: 100%;
    min-height: 40px;
    align-items: stretch;
    gap: 10px;
    border: 1px solid var(--border);
    border-radius: var(--border-radius-low);
    cursor: pointer;
    position: relative;
    opacity: 0;
    transition: opacity 0.5s, transform 0.5s, background-color 0.2s;
    transform: translateY(100%);
    pointer-events: none;
    user-select: none;
}

.toast-item:hover {
    background-color: var(--fill-light);
}

.toast-open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: unset;
    user-select: unset;
}

.toast-color-indicator {
    width: 5px;
    border-top-left-radius: var(--border-radius-low);
    border-bottom-left-radius: var(--border-radius-low);
}

.toast-item-content {
    box-sizing: border-box;
    padding: 5px 15px 5px 5px;
    justify-content: space-between;
    width: 100%;
}

.toast-item .icon {
    opacity: 0;
    transition: opacity 0.2s;
}

.toast-item:hover .icon {
    opacity: 1;
}

.toast-color-info {
    background-color: var(--info);
}

.toast-color-success {
    background-color: var(--success);
}

.toast-color-warning {
    background-color: var(--warning);
}

.toast-color-danger {
    background-color: var(--danger);
}
</style>