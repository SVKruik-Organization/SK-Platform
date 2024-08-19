<script lang="ts">
import { defineComponent } from 'vue';
import type { RouteLocation } from 'vue-router';

export default defineComponent({
    name: "App",
    watch: {
        $route(to: RouteLocation, _from: RouteLocation) {
            let base: string = to.path.split("/")[1];
            if (base.length) {
                base = base.charAt(0).toUpperCase() + base.slice(1);
            } else base = "Home";
            document.title = `SK Platform | ${base}`;
        }
    }
});
</script>

<template>
    <RouterView></RouterView>
</template>

<style scoped></style>
