<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "UnauthorizedView"
});
</script>

<template>
    <div class="content-parent flex-col">
        <p>401 Unauthorized Page</p>
        <RouterLink to="/home/landing">Go back Home</RouterLink>
    </div>
</template>

<style scoped></style>
