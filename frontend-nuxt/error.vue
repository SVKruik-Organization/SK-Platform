<script setup lang="ts">
import type { NuxtError } from '#app';

// Props
defineProps({
    error: Object as () => NuxtError
});

// Methods
function handleError(): void {
    clearError({ redirect: "/" });
}
</script>

<template>
    <div class="content-parent flex-col">
        <article class="flex-col">
            <h2>Whoops! Something went wrong.</h2>
            <strong>Some error occured while retrieving the requested data.</strong>
            <p>This might happen due to a network error or some server struggling to keep up.</p>
            <p class="back-link link-text" @click="handleError">Go back</p>
            <div class="flex">
                <p class="light-text">For the devs, this is want went wrong: {{ `${error?.message || "No message"}
                    ${error?.statusCode || 500}` }}</p>
            </div>
        </article>
    </div>
</template>

<style scoped>
.content-parent {
    height: calc(100vh - 256px);
    width: 100%;
    justify-content: center;
    align-items: center;
}

article {
    align-items: center;
    gap: 10px;
    max-width: 700px;
    text-align: center;
}

.back-link {
    margin: 20px 0;
}

@media (width <=700px) {
    article {
        width: 95%;
    }

    article > p {
        max-width: 400px;
    }
}
</style>
