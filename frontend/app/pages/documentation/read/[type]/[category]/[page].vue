<script setup lang="ts">
import { type DocumentationTypes } from "@/assets/customTypes";

// Setup
const route = useRoute();

// Route Params
const type: Ref<DocumentationTypes> = ref(route.params.type as DocumentationTypes);
const category: Ref<string> = ref(route.params.category as string);
const page: Ref<string> = ref(route.params.page as string);
</script>

<template>
    <DocumentationRead :type="type" :category="category" :page="page" />
</template>