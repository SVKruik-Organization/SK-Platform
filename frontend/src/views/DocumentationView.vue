<script lang="ts">
import { fetchDocs } from '@/utils/fetch';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DocumentationView",
    data() {
        return {
            "html": ""
        }
    },
    async mounted() {
        const data = await fetchDocs("Get_Started", "Introduction", "v1");
        if (typeof data === "string") return;
        this.html = data.file;
    }
});
</script>

<template>
    <main>
        <h1>Documentation View</h1>
        <div v-html="html"></div>
    </main>
</template>

<style scoped></style>
