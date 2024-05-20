<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "NotFoundView"
});
</script>

<template>
    <div class="content-parent flex-col">
        <p>404 Not Found Page</p>
        <RouterLink to="/home/landing">Go back Home</RouterLink>
    </div>
</template>

<style scoped></style>
